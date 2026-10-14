import { NextRequest, NextResponse } from "next/server";
import { computeRollups } from "@/services/analytics.service";

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
    const result = await computeRollups();
    return NextResponse.json({ ok: true, data: result });
  } catch (error: unknown) {
    console.error("Cron rollups failed:", error);
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
