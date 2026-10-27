import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { getFileExtension } from "./upload-limits";

export interface SaveFileOptions {
  category: "images" | "resources" | "tmp";
  subfolder?: string;
  originalName: string;
  buffer: Buffer;
  mime: string;
}

export interface StoredFileResult {
  fileKey: string;
  originalName: string;
  storedName: string;
  mime: string;
  size: number;
  url: string;
}

export interface StorageProvider {
  saveFile(options: SaveFileOptions): Promise<StoredFileResult>;
  getFile(fileKey: string): Promise<{ stream: fs.ReadStream; size: number } | null>;
  getFileBuffer(fileKey: string): Promise<{ buffer: Buffer; size: number } | null>;
  deleteFile(fileKey: string): Promise<boolean>;
  getPublicUrl(fileKey: string): string;
}

// ---------------------------------------------------------------------------
// Local Disk Provider (fallback when CLOUDINARY_URL is not set)
// ---------------------------------------------------------------------------

export class LocalDiskProvider implements StorageProvider {
  private baseDir: string;

  constructor(customBaseDir?: string) {
    this.baseDir = path.resolve(
      /*turbopackIgnore: true*/ (customBaseDir || process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads"))
    );
    this.ensureBaseDirs();
  }

  private ensureBaseDirs() {
    try {
      if (!fs.existsSync(/*turbopackIgnore: true*/ this.baseDir)) {
        fs.mkdirSync(this.baseDir, { recursive: true });
      }
      for (const sub of ["images", "resources", "tmp"]) {
        const subPath = path.join(/*turbopackIgnore: true*/ this.baseDir, sub);
        if (!fs.existsSync(/*turbopackIgnore: true*/ subPath)) {
          fs.mkdirSync(subPath, { recursive: true });
        }
      }
    } catch (err) {
      console.error("[Storage] Failed to initialize storage directories:", err);
    }
  }

  private resolveSafePath(fileKey: string): string {
    // Prevent directory traversal attacks
    const sanitizedKey = fileKey.replace(/\\/g, "/").replace(/\.\./g, "");
    const fullPath = path.resolve(this.baseDir, sanitizedKey);

    if (!fullPath.startsWith(this.baseDir)) {
      throw new Error("Invalid file key: Path traversal attempt detected");
    }

    return fullPath;
  }

  public async saveFile(options: SaveFileOptions): Promise<StoredFileResult> {
    const ext = getFileExtension(options.originalName);
    const storedName = `${nanoid(20)}${ext}`;

    const subfolder = options.subfolder ? options.subfolder.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "") : "";
    const targetDir = subfolder
      ? path.join(this.baseDir, options.category, subfolder)
      : path.join(this.baseDir, options.category);

    await fs.promises.mkdir(targetDir, { recursive: true });

    const targetPath = path.join(targetDir, storedName);
    await fs.promises.writeFile(targetPath, options.buffer);

    // fileKey is relative to baseDir with forward slashes
    const fileKey = [options.category, subfolder, storedName]
      .filter(Boolean)
      .join("/");

    const url = this.getPublicUrl(fileKey);

    return {
      fileKey,
      originalName: options.originalName,
      storedName,
      mime: options.mime,
      size: options.buffer.length,
      url,
    };
  }

  public async getFile(fileKey: string): Promise<{ stream: fs.ReadStream; size: number } | null> {
    try {
      const filePath = this.resolveSafePath(fileKey);
      const stat = await fs.promises.stat(filePath);
      if (!stat.isFile()) return null;

      const stream = fs.createReadStream(filePath);
      return { stream, size: stat.size };
    } catch {
      return null;
    }
  }

  public async getFileBuffer(fileKey: string): Promise<{ buffer: Buffer; size: number } | null> {
    try {
      const filePath = this.resolveSafePath(fileKey);
      const stat = await fs.promises.stat(filePath);
      if (!stat.isFile()) return null;

      const buffer = await fs.promises.readFile(filePath);
      return { buffer, size: stat.size };
    } catch {
      return null;
    }
  }

  public async deleteFile(fileKey: string): Promise<boolean> {
    try {
      const filePath = this.resolveSafePath(fileKey);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err) {
      console.error(`[Storage] Failed to delete file ${fileKey}:`, err);
      return false;
    }
  }

  public getPublicUrl(fileKey: string): string {
    const normalizedKey = fileKey.replace(/\\/g, "/");
    if (normalizedKey.startsWith("images/")) {
      // Strips "images/" and routes to /api/files/images/
      const subPath = normalizedKey.replace(/^images\//, "");
      return `/api/files/images/${subPath}`;
    }
    // Private resources are accessed via resource endpoint
    return `/api/files/resources/${encodeURIComponent(normalizedKey)}`;
  }
}

// ---------------------------------------------------------------------------
// Cloudinary Provider (primary when CLOUDINARY_URL is set)
// ---------------------------------------------------------------------------

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

/** Parse CLOUDINARY_URL once at module load and configure the SDK. */
function initCloudinary(): boolean {
  let url = process.env.CLOUDINARY_URL?.trim();
  if (!url) return false;
  // Strip surrounding quotes if present in .env
  url = url.replace(/^["']|["']$/g, "").trim();
  if (!url || !url.startsWith("cloudinary://")) return false;

  try {
    const parsed = new URL(url.replace("cloudinary://", "https://"));
    cloudinary.config({
      cloud_name: parsed.hostname,
      api_key: decodeURIComponent(parsed.username),
      api_secret: decodeURIComponent(parsed.password),
      secure: true,
    });
    return Boolean(parsed.hostname && parsed.username && parsed.password);
  } catch {
    console.error("[Storage] Invalid CLOUDINARY_URL format");
    return false;
  }
}

export class CloudinaryProvider implements StorageProvider {
  private fallbackLocal: LocalDiskProvider;

  constructor() {
    if (!initCloudinary()) {
      throw new Error("[Storage] CloudinaryProvider requires a valid CLOUDINARY_URL env var");
    }
    this.fallbackLocal = new LocalDiskProvider();
    console.log("[Storage] Cloudinary provider initialized");
  }

  /**
   * Determine the Cloudinary resource_type from the file category/mime.
   * - "image" for images (so Cloudinary can apply transformations and optimization)
   * - "raw"   for documents/resources (PDFs, ZIPs, DOCX, CSV, etc.)
   */
  private getResourceType(category: string, mime: string): "image" | "raw" {
    if (category === "images" || mime.startsWith("image/")) return "image";
    return "raw";
  }

  public async saveFile(options: SaveFileOptions): Promise<StoredFileResult> {
    const ext = getFileExtension(options.originalName);
    const storedName = `${nanoid(20)}${ext}`;

    const subfolder = options.subfolder
      ? options.subfolder.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "")
      : "";

    // Build Cloudinary folder hierarchy, e.g. "lms/images/avatars/admin/123"
    const folderParts = ["lms", options.category, subfolder].filter(Boolean);
    const folder = folderParts.join("/");

    const resourceType = this.getResourceType(options.category, options.mime);

    // For raw resources (PDFs, ZIPs), Cloudinary requires the extension in public_id
    // to preserve filename/mime on download. For images, Cloudinary manages the extension via format.
    const publicId = resourceType === "raw" ? storedName : storedName.replace(/\.[^/.]+$/, "");

    // Upload buffer to Cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: resourceType,
          overwrite: true,
          ...(resourceType === "image" ? { format: ext.replace(".", "") || "webp" } : {}),
        },
        (error, uploadResult) => {
          if (error) return reject(error);
          if (!uploadResult) return reject(new Error("Cloudinary upload returned no result"));
          resolve(uploadResult);
        }
      );
      uploadStream.end(options.buffer);
    });

    const fileKey = result.public_id;
    const url = result.secure_url;

    return {
      fileKey,
      originalName: options.originalName,
      storedName,
      mime: options.mime,
      size: options.buffer.length,
      url,
    };
  }

  /**
   * For Cloudinary, streaming from remote is done via getFileBuffer.
   * If the file is a legacy local file, delegates to local disk provider.
   */
  public async getFile(fileKey: string): Promise<{ stream: fs.ReadStream; size: number } | null> {
    if (!fileKey.startsWith("lms/")) {
      return this.fallbackLocal.getFile(fileKey);
    }
    return null;
  }

  /**
   * Fetch a file from Cloudinary by its public_id (fileKey) or direct URL.
   * Used for auth-gated resource downloads.
   * Seamlessly falls back to local disk for legacy files.
   */
  public async getFileBuffer(fileKey: string): Promise<{ buffer: Buffer; size: number } | null> {
    try {
      // If legacy local file key, serve directly from local disk
      if (!fileKey.startsWith("lms/") && !fileKey.startsWith("http://") && !fileKey.startsWith("https://")) {
        return this.fallbackLocal.getFileBuffer(fileKey);
      }

      let fetchUrl: string;
      if (fileKey.startsWith("http://") || fileKey.startsWith("https://")) {
        fetchUrl = fileKey;
      } else {
        const isImage = fileKey.startsWith("lms/images");
        fetchUrl = cloudinary.url(fileKey, {
          resource_type: isImage ? "image" : "raw",
          secure: true,
        });
      }

      const response = await fetch(fetchUrl);
      if (!response.ok) {
        // Fallback to local disk in case file was migrated or stored locally
        return this.fallbackLocal.getFileBuffer(fileKey);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return { buffer, size: buffer.length };
    } catch (err) {
      console.error(`[Storage/Cloudinary] Failed to fetch file ${fileKey}:`, err);
      return this.fallbackLocal.getFileBuffer(fileKey);
    }
  }

  /**
   * Delete a file from Cloudinary by its public_id, or local disk if legacy key.
   */
  public async deleteFile(fileKey: string): Promise<boolean> {
    try {
      if (fileKey.startsWith("lms/")) {
        const isImage = fileKey.startsWith("lms/images");
        const resourceType = isImage ? "image" : "raw";

        const result = await cloudinary.uploader.destroy(fileKey, {
          resource_type: resourceType,
          invalidate: true,
        });
        return result.result === "ok";
      }

      return this.fallbackLocal.deleteFile(fileKey);
    } catch (err) {
      console.error(`[Storage/Cloudinary] Failed to delete file ${fileKey}:`, err);
      return false;
    }
  }

  /**
   * Returns the public URL for a file:
   * - Images: Direct Cloudinary CDN URL (optimized & fast)
   * - Legacy Images: Redirect route /api/files/images/...
   * - Resources: Auth-gated proxy API route /api/files/resources/...
   */
  public getPublicUrl(fileKey: string): string {
    if (fileKey.startsWith("http://") || fileKey.startsWith("https://")) {
      return fileKey;
    }
    if (fileKey.startsWith("lms/images")) {
      return cloudinary.url(fileKey, { resource_type: "image", secure: true });
    }
    if (fileKey.startsWith("images/")) {
      const rel = fileKey.replace(/^images\//, "");
      return `/api/files/images/${rel.split("/").map(encodeURIComponent).join("/")}`;
    }
    // Resources still go through the auth-gated proxy API route
    return `/api/files/resources/${encodeURIComponent(fileKey)}`;
  }
}

// ---------------------------------------------------------------------------
// Exported singleton — auto-selects provider based on CLOUDINARY_URL
// ---------------------------------------------------------------------------

function createStorageProvider(): StorageProvider {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim().replace(/^["']|["']$/g, "").trim();
  if (cloudinaryUrl && cloudinaryUrl.startsWith("cloudinary://")) {
    try {
      return new CloudinaryProvider();
    } catch (err) {
      console.error("[Storage] Failed to initialize Cloudinary, falling back to local disk:", err);
      return new LocalDiskProvider();
    }
  }
  return new LocalDiskProvider();
}

export const storage: StorageProvider = createStorageProvider();
