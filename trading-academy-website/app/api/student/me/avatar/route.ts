import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { requireStudent } from "@/lib/guards";
import { assertSameOrigin, getIp } from "@/lib/auth";
import { toErrorResponse, ApiError } from "@/lib/errors";
import { connectToDatabase } from "@/lib/db";
import { storage } from "@/lib/storage";
import { validateMimeType } from "@/lib/mime-check";
import { UPLOAD_LIMITS } from "@/lib/upload-limits";
import { User } from "@/models/User";
import { recordAuditLog } from "@/services/audit.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    assertSameOrigin(req);
    const auth = await requireStudent();
    await connectToDatabase();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      throw ApiError.badRequest("No image file provided");
    }

    if (file.size > UPLOAD_LIMITS.IMAGE.MAX_SIZE_BYTES) {
      throw ApiError.badRequest(
        `Avatar exceeds maximum allowed size of ${UPLOAD_LIMITS.IMAGE.MAX_SIZE_LABEL}`
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // Verify magic bytes
    const mimeValidation = await validateMimeType(
      rawBuffer,
      file.type,
      file.name,
      "image"
    );

    if (!mimeValidation.valid) {
      throw ApiError.badRequest(
        mimeValidation.error || "Invalid image format detected"
      );
    }

    // Re-encode to 512x512 WebP to strip EXIF/GPS metadata and neutralize polyglots
    let processedBuffer: Buffer;
    try {
      processedBuffer = await sharp(rawBuffer)
        .resize(512, 512, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: 85 })
        .toBuffer();
    } catch (sharpErr: any) {
      console.error("[Avatar Processing Error]:", sharpErr);
      throw ApiError.badRequest("Unable to process image. File may be corrupted.");
    }

    // Save to local storage: {UPLOAD_DIR}/images/avatars/student/{userId}/...
    const result = await storage.saveFile({
      category: "images",
      subfolder: `avatars/student/${auth.id}`,
      originalName: "avatar.webp",
      buffer: processedBuffer,
      mime: "image/webp",
    });

    const user = await User.findById(auth.id);
    if (!user) {
      throw ApiError.notFound("Student user not found");
    }

    const oldKey = user.avatar?.key;
    const oldUrl = user.avatar?.url;

    // Update DB first (safe replacement)
    user.avatar = {
      key: result.fileKey,
      url: result.url,
      updatedAt: new Date(),
    };
    await user.save();

    // Only after DB update succeeds: safely delete the old file
    if (oldKey && oldKey !== result.fileKey) {
      try {
        await storage.deleteFile(oldKey);
      } catch (cleanupErr) {
        console.error("[Avatar Storage] Cleanup of previous avatar failed:", cleanupErr);
      }
    }

    const ip = getIp(req);
    await recordAuditLog({
      actorId: String(user._id),
      action: "student.avatar.update",
      entityType: "user",
      entityId: String(user._id),
      summary: "Student updated profile avatar",
      before: { avatarUrl: oldUrl },
      after: { avatarUrl: result.url, fileKey: result.fileKey },
      ip,
    });

    return NextResponse.json({
      ok: true,
      data: {
        url: result.url,
        key: result.fileKey,
        size: processedBuffer.length,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    assertSameOrigin(req);
    const auth = await requireStudent();
    await connectToDatabase();

    const user = await User.findById(auth.id);
    if (!user) {
      throw ApiError.notFound("Student user not found");
    }

    const oldKey = user.avatar?.key;
    const oldUrl = user.avatar?.url;

    user.avatar = {
      key: "",
      url: "",
      updatedAt: new Date(),
    };
    await user.save();

    if (oldKey) {
      try {
        await storage.deleteFile(oldKey);
      } catch (cleanupErr) {
        console.error("[Avatar Storage] Cleanup on delete failed:", cleanupErr);
      }
    }

    const ip = getIp(req);
    await recordAuditLog({
      actorId: String(user._id),
      action: "student.avatar.delete",
      entityType: "user",
      entityId: String(user._id),
      summary: "Student removed profile avatar",
      before: { avatarUrl: oldUrl },
      after: { avatarUrl: "" },
      ip,
    });

    return NextResponse.json({
      ok: true,
      data: {
        success: true,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
