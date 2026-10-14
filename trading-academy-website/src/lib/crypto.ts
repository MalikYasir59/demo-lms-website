import crypto from "crypto";

// AES-256-GCM requires a 32-byte key (256 bits)
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Standard 96-bit IV for GCM
const TAG_LENGTH = 16; // Standard 128-bit authentication tag

function getEncryptionKey(): Buffer {
  const envKey = process.env.VIDEO_ENC_KEY;
  if (envKey) {
    try {
      const buf = Buffer.from(envKey, "base64");
      if (buf.length === 32) return buf;
    } catch {
      // Fall through to error
    }
  }

  // Development fallback key (never used in production)
  if (process.env.NODE_ENV !== "production") {
    return crypto.createHash("sha256").update("itt-development-video-encryption-key-fallback").digest();
  }

  throw new Error("VIDEO_ENC_KEY must be a valid 32-byte Base64 string in production environment.");
}

export interface EncryptedPayload {
  enc: string; // Ciphertext in Base64
  iv: string;  // IV in Base64
  tag: string; // Authentication tag in Base64
}

/**
 * Encrypts a YouTube video ID at rest using AES-256-GCM.
 */
export function encryptVideoId(videoId: string): EncryptedPayload {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });

  let encrypted = cipher.update(videoId, "utf8", "base64");
  encrypted += cipher.final("base64");
  const tag = cipher.getAuthTag().toString("base64");

  return {
    enc: encrypted,
    iv: iv.toString("base64"),
    tag: tag,
  };
}

/**
 * Decrypts an encrypted YouTube video reference using AES-256-GCM.
 * Validates integrity via the GCM authentication tag.
 */
export function decryptVideoId(payload: EncryptedPayload): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(payload.iv, "base64");
  const tag = Buffer.from(payload.tag, "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });

  decipher.setAuthTag(tag);
  let decrypted = decipher.update(payload.enc, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Generates an HMAC-SHA256 signature of a video ID.
 * This allows checking for duplicate video uploads in the database without having to decrypt all stored video records.
 */
export function hashVideoId(videoId: string): string {
  const key = getEncryptionKey();
  return crypto.createHmac("sha256", key).update(videoId.trim()).digest("hex");
}
