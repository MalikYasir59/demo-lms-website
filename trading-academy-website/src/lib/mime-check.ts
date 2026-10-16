import { fileTypeFromBuffer } from "file-type";
import { isAllowedImageMime, isAllowedResourceMime, getFileExtension } from "./upload-limits";

export interface MimeValidationResult {
  valid: boolean;
  detectedMime?: string;
  error?: string;
}

/**
 * Sniffs the magic bytes of a buffer to verify its real MIME type.
 * For plain text / CSV files that lack magic bytes, validates buffer content encoding.
 */
export async function validateMimeType(
  buffer: Buffer,
  declaredMime: string,
  filename: string,
  category: "image" | "resource"
): Promise<MimeValidationResult> {
  const ext = getFileExtension(filename);
  const detected = await fileTypeFromBuffer(buffer);

  if (category === "image") {
    if (!detected) {
      return {
        valid: false,
        error: "Unable to verify image format. Magic bytes missing or corrupted.",
      };
    }

    if (!isAllowedImageMime(detected.mime)) {
      return {
        valid: false,
        detectedMime: detected.mime,
        error: `File type ${detected.mime} is not an allowed image format.`,
      };
    }

    return { valid: true, detectedMime: detected.mime };
  }

  // Category: resource
  if (detected) {
    if (isAllowedResourceMime(detected.mime)) {
      return { valid: true, detectedMime: detected.mime };
    }

    // Zip files can have variations (e.g. application/zip, docx/xlsx are zip containers)
    if (detected.mime === "application/zip" || detected.mime === "application/x-zip-compressed") {
      if ([".zip", ".docx", ".xlsx"].includes(ext)) {
        return { valid: true, detectedMime: detected.mime };
      }
    }

    return {
      valid: false,
      detectedMime: detected.mime,
      error: `Detected file type ${detected.mime} is not allowed for lecture resources.`,
    };
  }

  // Plain text formats (.txt, .csv) do not have magic bytes
  if (ext === ".txt" || ext === ".csv") {
    // Check if buffer contains null bytes (binary indicator)
    const isBinary = buffer.slice(0, 1024).some((byte) => byte === 0);
    if (isBinary) {
      return {
        valid: false,
        error: "Binary content detected in text file.",
      };
    }
    const safeMime = ext === ".csv" ? "text/csv" : "text/plain";
    return { valid: true, detectedMime: safeMime };
  }

  return {
    valid: false,
    error: "File format could not be verified or is not supported.",
  };
}
