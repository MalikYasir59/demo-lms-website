import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guards";
import { assertSameOrigin } from "@/lib/auth";
import { toErrorResponse, ApiError } from "@/lib/errors";
import { storage } from "@/lib/storage";
import { validateMimeType } from "@/lib/mime-check";
import { UPLOAD_LIMITS } from "@/lib/upload-limits";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    assertSameOrigin(req);
    await requireAdmin();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const subfolder = (formData.get("subfolder") as string) || "misc";

    if (!file) {
      throw ApiError.badRequest("No file uploaded");
    }

    if (file.size > UPLOAD_LIMITS.IMAGE.MAX_SIZE_BYTES) {
      throw ApiError.badRequest(
        `Image exceeds maximum allowed size of ${UPLOAD_LIMITS.IMAGE.MAX_SIZE_LABEL}`
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify magic bytes
    const mimeValidation = await validateMimeType(
      buffer,
      file.type,
      file.name,
      "image"
    );

    if (!mimeValidation.valid) {
      throw ApiError.badRequest(
        mimeValidation.error || "Invalid image format detected"
      );
    }

    const result = await storage.saveFile({
      category: "images",
      subfolder,
      originalName: file.name,
      buffer,
      mime: mimeValidation.detectedMime || file.type,
    });

    return NextResponse.json({
      ok: true,
      data: {
        url: result.url,
        fileKey: result.fileKey,
        originalName: result.originalName,
        size: result.size,
        mime: result.mime,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
