import { AuditLog } from "@/models/AuditLog";
import { connectToDatabase } from "@/lib/db";

const REDACTED_KEYS = new Set([
  "password",
  "passwordHash",
  "token",
  "secret",
  "ref",
  "videoEncKey",
  "apiKey",
]);

function redactSensitive(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object") {
    return {};
  }

  const cleaned: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
    if (REDACTED_KEYS.has(key) || key.toLowerCase().includes("password")) {
      cleaned[key] = "[REDACTED]";
    } else if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      cleaned[key] = redactSensitive(val);
    } else {
      cleaned[key] = val;
    }
  }
  return cleaned;
}

export interface RecordAuditParams {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  ip?: string;
}

export async function recordAuditLog(params: RecordAuditParams) {
  try {
    await connectToDatabase();

    const diff = {
      before: params.before ? redactSensitive(params.before) : undefined,
      after: params.after ? redactSensitive(params.after) : undefined,
    };

    await AuditLog.create({
      actorId: params.actorId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      summary: params.summary,
      diff,
      ip: params.ip || "127.0.0.1",
    });
  } catch (err) {
    // Audit logging should not crash the primary transaction, but should be logged to stderr
    console.error("[AuditLog Error]: Failed to persist audit record:", err);
  }
}

export default recordAuditLog;
