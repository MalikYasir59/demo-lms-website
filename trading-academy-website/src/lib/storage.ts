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

export const storage = new LocalDiskProvider();
