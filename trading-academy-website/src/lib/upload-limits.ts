export const UPLOAD_LIMITS = {
  IMAGE: {
    MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB
    MAX_SIZE_LABEL: "5 MB",
    ALLOWED_MIMES: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ] as const,
    ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp", ".gif"] as const,
  },
  RESOURCE: {
    MAX_SIZE_BYTES: 50 * 1024 * 1024, // 50 MB
    MAX_SIZE_LABEL: "50 MB",
    ALLOWED_MIMES: [
      "application/pdf",
      "application/zip",
      "application/x-zip-compressed",
      "text/plain",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ] as const,
    ALLOWED_EXTENSIONS: [
      ".pdf",
      ".zip",
      ".txt",
      ".csv",
      ".xls",
      ".xlsx",
      ".doc",
      ".docx",
    ] as const,
    MAX_PER_LECTURE: 10,
  },
} as const;

export type AllowedImageMime = (typeof UPLOAD_LIMITS.IMAGE.ALLOWED_MIMES)[number];
export type AllowedResourceMime = (typeof UPLOAD_LIMITS.RESOURCE.ALLOWED_MIMES)[number];

export function isAllowedImageMime(mime: string): mime is AllowedImageMime {
  return (UPLOAD_LIMITS.IMAGE.ALLOWED_MIMES as readonly string[]).includes(mime);
}

export function isAllowedResourceMime(mime: string): mime is AllowedResourceMime {
  return (UPLOAD_LIMITS.RESOURCE.ALLOWED_MIMES as readonly string[]).includes(mime);
}

export function getFileExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  if (idx === -1 || idx === filename.length - 1) return "";
  return filename.slice(idx).toLowerCase();
}
