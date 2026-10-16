import { withApi } from "@/lib/api";
import { AuthSession } from "@/models/AuthSession";
import { ApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async ({ auth }) => {
    const sessions = await AuthSession.find({
      userId: auth!.id,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    })
      .sort({ lastSeenAt: -1 })
      .lean();

    return sessions.map((s) => ({
      sid: s.sid,
      deviceId: s.deviceId,
      deviceLabel: s.deviceLabel,
      ip: s.ip,
      ua: s.ua,
      lastSeenAt: s.lastSeenAt,
      createdAt: s.createdAt,
      isCurrent: s.sid === auth!.sid,
    }));
  }
);

export const DELETE = withApi(
  {
    role: "admin",
  },
  async ({ req, auth }) => {
    const { searchParams } = new URL(req.url);
    const sid = searchParams.get("sid");

    if (!sid) {
      throw ApiError.badRequest("Session ID (sid) is required");
    }

    const session = await AuthSession.findOne({
      sid,
      userId: auth!.id,
      revokedAt: null,
    });

    if (!session) {
      throw ApiError.notFound("Session not found or already revoked");
    }

    session.revokedAt = new Date();
    session.revokedReason = "admin";
    await session.save();

    return { success: true, revokedSid: sid };
  }
);
