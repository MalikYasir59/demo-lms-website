import { RateLimit } from "@/models/RateLimit";
import { connectToDatabase } from "./db";
import { ApiError } from "./errors";

export async function rateLimit(
  key: string,
  max: number,
  windowSec: number
): Promise<{ count: number; remaining: number; resetAt: Date }> {
  await connectToDatabase();

  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowSec * 1000);

  // Atomically find active window or create a new one
  const record = await RateLimit.findOneAndUpdate(
    { key, expiresAt: { $gt: now } },
    {
      $inc: { count: 1 },
      $setOnInsert: { key, windowStart: now, expiresAt },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (record.count > max) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((record.expiresAt.getTime() - now.getTime()) / 1000)
    );
    throw ApiError.rateLimited(
      `Rate limit exceeded. Please wait ${retryAfterSec} seconds before retrying.`
    );
  }

  return {
    count: record.count,
    remaining: Math.max(0, max - record.count),
    resetAt: record.expiresAt,
  };
}

export default rateLimit;
