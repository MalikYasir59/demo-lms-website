import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";
import { AuthSession } from "@/models/AuthSession";
import { User } from "@/models/User";
import { connectToDatabase } from "./db";
import { ApiError } from "./errors";
import { ERROR_CODES, USER_STATUS, UserRole } from "./constants";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

/**
 * Validates that the session ID (sid) stored in the NextAuth JWT
 * is still active in MongoDB and has not been revoked (e.g. by a replacement login or admin action).
 */
export async function validateSession(sid: string, userId: string) {
  await connectToDatabase();

  const [authSession, user] = await Promise.all([
    AuthSession.findOne({ sid, userId }).lean(),
    User.findById(userId).select("status security deletedAt").lean(),
  ]);

  if (!authSession) {
    throw ApiError.unauthorized("Session not found", ERROR_CODES.AUTH_REQUIRED);
  }

  if (authSession.revokedAt) {
    throw ApiError.unauthorized(
      "Your session was terminated because another device signed in or an administrator ended it.",
      ERROR_CODES.SESSION_REPLACED
    );
  }

  if (new Date(authSession.expiresAt) < new Date()) {
    throw ApiError.unauthorized("Session expired", ERROR_CODES.AUTH_REQUIRED);
  }

  if (!user || user.deletedAt) {
    throw ApiError.unauthorized("Account no longer exists", ERROR_CODES.AUTH_REQUIRED);
  }

  if (user.security?.securityLocked) {
    throw ApiError.securityLocked("Account is locked by the anti-piracy security system.");
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw ApiError.forbidden("Account is inactive or suspended", ERROR_CODES.ACCOUNT_INACTIVE);
  }

  // Update lastSeenAt asynchronously (fire-and-forget to keep requests fast)
  AuthSession.updateOne({ sid }, { $set: { lastSeenAt: new Date() } }).catch((err) => {
    console.error("Failed to update session lastSeenAt:", err);
  });

  return { session: authSession, user };
}

export function getIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

export function getUA(req: Request): string {
  return req.headers.get("user-agent") || "Unknown";
}

export function assertSameOrigin(req: Request): void {
  const method = req.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return;
  }

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  if (!origin || !host) {
    return; // Allow non-browser server-to-server calls or cron if header verified separately
  }

  try {
    const originUrl = new URL(origin);
    if (originUrl.host !== host) {
      throw ApiError.forbidden("Cross-origin mutation request blocked");
    }
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw ApiError.forbidden("Invalid request origin");
  }
}
