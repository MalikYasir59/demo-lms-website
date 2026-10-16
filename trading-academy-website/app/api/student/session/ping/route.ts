import { withApi } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { AuthSession } from "@/models/AuthSession";

export const dynamic = "force-dynamic";

export const POST = withApi(
  {
    role: "student",
  },
  async ({ auth }) => {
    await connectToDatabase();

    if (auth?.sid) {
      await AuthSession.findOneAndUpdate(
        { sid: auth.sid, userId: auth.id },
        { $set: { lastSeenAt: new Date() } }
      );
    }

    return { alive: true, timestamp: new Date().toISOString() };
  }
);
