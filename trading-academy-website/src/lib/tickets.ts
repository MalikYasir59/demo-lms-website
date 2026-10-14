import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";

const TICKET_SECRET = new TextEncoder().encode(
  process.env.TICKET_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "fallback-secret-for-playback-tickets-change-in-production"
);

export function hashClientFingerprint(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex").slice(0, 32);
}

export interface PlaybackTicketPayload {
  jti: string;
  userId: string;
  sid: string;
  lectureId: string;
  ipHash: string;
  uaHash: string;
}

/**
 * Creates a signed JWT playback ticket with 90-second validity.
 */
export async function createPlaybackTicket(
  payload: PlaybackTicketPayload
): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(payload.jti)
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime("90s")
    .sign(TICKET_SECRET);
}

/**
 * Verifies a playback ticket JWT signature and returns decoded claims.
 */
export async function verifyPlaybackTicket(
  token: string
): Promise<PlaybackTicketPayload> {
  const { payload } = await jwtVerify(token, TICKET_SECRET);
  return payload as unknown as PlaybackTicketPayload;
}
