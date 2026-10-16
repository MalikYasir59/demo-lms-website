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
    const lectureId = (formData.get("lectureId") as string) || "";

    if (!file) {
      throw ApiError.badRequest("No file uploaded");
    }

    if (file.size > UPLOAD_LIMITS.RESOURCE.MAX_SIZE_BYTES) {
      throw ApiError.badRequest(
        `File exceeds maximum allowed size of ${UPLOAD_LIMITS.RESOURCE.MAX_SIZE_LABEL}`
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify magic bytes
    const mimeValidation = await validateMimeType(
      buffer,
      file.type,
      file.name,
      "resource"
    );

    if (!mimeValidation.valid) {
      throw ApiError.badRequest(
        mimeValidation.error || "Invalid file format for lecture resource"
      );
    }

    const subfolder = lectureId ? `lectures/${lectureId}` : "general";

    const result = await storage.saveFile({
      category: "resources",
      subfolder,
      originalName: file.name,
      buffer,
      mime: mimeValidation.detectedMime || file.type,
    });

    return NextResponse.json({
      ok: true,
      data: {
        fileKey: result.fileKey,
        originalName: result.originalName,
        storedName: result.storedName,
        mime: result.mime,
        size: result.size,
        url: result.url,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
