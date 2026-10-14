import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus = "not_configured";

  if (process.env.MONGODB_URI) {
    try {
      const conn = await connectToDatabase();
      dbStatus = conn.connection.readyState === 1 ? "connected" : "connecting";
    } catch (err) {
      console.error("[Health Check DB Error]:", err);
      dbStatus = "error";
    }
  }

  return NextResponse.json(
    {
      ok: true,
      data: {
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: dbStatus,
        uptime: Math.floor(process.uptime()),
        version: "1.0.0",
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
