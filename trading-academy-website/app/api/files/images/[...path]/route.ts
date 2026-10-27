import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getFileExtension } from "@/lib/upload-limits";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const pathSegments = resolvedParams.path || [];

    if (!pathSegments.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const rawPath = pathSegments.join("/");
    const fileKey = rawPath.startsWith("lms/") ? rawPath : ["images", ...pathSegments].join("/");

    // If the storage provider is Cloudinary or has a direct URL, redirect to CDN URL
    const publicUrl = storage.getPublicUrl(fileKey);
    if (publicUrl.startsWith("http://") || publicUrl.startsWith("https://")) {
      return NextResponse.redirect(publicUrl, { status: 302 });
    }

    // Legacy local file serving
    const result = await storage.getFileBuffer(fileKey);

    if (!result) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    const filename = pathSegments[pathSegments.length - 1];
    const ext = getFileExtension(filename);
    const contentType = MIME_MAP[ext] || "application/octet-stream";

    return new NextResponse(result.buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": result.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[Image Server Error]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

