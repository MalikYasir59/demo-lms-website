import { NextResponse } from "next/server";
import { connectToDatabase, ALLOWED_DB_NAME } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbInfo: {
    state: string;
    name?: string;
    latencyMs?: number;
    error?: string;
  } = {
    state: "not_configured",
  };

  if (process.env.MONGODB_URI) {
    try {
      const startTime = performance.now();
      const conn = await connectToDatabase();

      if (conn.connection.readyState === 1 && conn.connection.db) {
        // Run ping command directly on the itt_lms database (no cluster-wide admin privilege needed)
        await conn.connection.db.command({ ping: 1 });
        const latencyMs = Math.round(performance.now() - startTime);

        dbInfo = {
          state: "connected",
          name: conn.connection.name || ALLOWED_DB_NAME,
          latencyMs,
        };
      } else {
        dbInfo = {
          state: conn.connection.readyState === 2 ? "connecting" : "disconnected",
          name: conn.connection.name || ALLOWED_DB_NAME,
        };
      }
    } catch (err: any) {
      console.error("[Health Check DB Error]:", err?.message || err);
      dbInfo = {
        state: "error",
        name: ALLOWED_DB_NAME,
        error: "Database connectivity check failed",
      };
    }
  }

  const isHealthy = dbInfo.state === "connected" || dbInfo.state === "not_configured";

  return NextResponse.json(
    {
      ok: isHealthy,
      data: {
        status: isHealthy ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
        database: dbInfo,
        uptime: Math.floor(process.uptime()),
        version: "1.0.0",
      },
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
