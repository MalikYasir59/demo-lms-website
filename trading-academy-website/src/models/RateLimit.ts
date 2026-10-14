import mongoose, { Schema, Model, Document } from "mongoose";
import { IRateLimit } from "@/types/lms";

export interface IRateLimitDocument
  extends Omit<IRateLimit, "_id">,
    Document {}

const RateLimitSchema = new Schema<IRateLimitDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    count: {
      type: Number,
      required: true,
      default: 1,
    },
    windowStart: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

// TTL index to automatically purge expired rate limit windows
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimit: Model<IRateLimitDocument> =
  mongoose.models.RateLimit ||
  mongoose.model<IRateLimitDocument>("RateLimit", RateLimitSchema);

export default RateLimit;
