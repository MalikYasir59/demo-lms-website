import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PlaybackSession } from "@/models/PlaybackSession";

function verifyCronSecret(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    if (process.env.NODE_ENV === "development") return true;
    return false;
  }

  const headerSecret = req.headers.get("x-cron-secret");
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  return headerSecret === cronSecret || bearerToken === cronSecret;
}

export async function POST(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Invalid cron secret" } },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();
    const now = new Date();
    // Two missed heartbeats = 30 seconds + buffer -> 60 seconds
    const staleThreshold = new Date(now.getTime() - 60 * 1000);

    const staleSessionsResult = await PlaybackSession.updateMany(
      {
        endedAt: null,
        lastHeartbeatAt: { $lt: staleThreshold },
      },
      {
        $set: {
          endedAt: now,
          endReason: "timeout",
        },
      }
    );

    return NextResponse.json({
      ok: true,
      data: {
        staleSessionsClosed: staleSessionsResult.modifiedCount,
        executedAt: now.toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("Cron cleanup failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "CRON_ERROR",
          message: error instanceof Error ? error.message : "Internal error",
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
