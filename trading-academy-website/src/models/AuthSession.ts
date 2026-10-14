import mongoose, { Schema, Model, Document } from "mongoose";
import { IAuthSession } from "@/types/lms";
import { REVOKED_REASONS } from "@/lib/constants";

export interface IAuthSessionDocument
  extends Omit<IAuthSession, "_id">,
    Document {}

const AuthSessionSchema = new Schema<IAuthSessionDocument>(
  {
    sid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    deviceLabel: {
      type: String,
      default: "Unknown Device",
    },
    ip: {
      type: String,
      required: true,
    },
    ua: {
      type: String,
      required: true,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },
    revokedReason: {
      type: String,
      enum: Object.values(REVOKED_REASONS),
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for active session checks
AuthSessionSchema.index({ userId: 1, revokedAt: 1 });

// TTL index to automatically purge expired sessions
AuthSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AuthSession: Model<IAuthSessionDocument> =
  mongoose.models.AuthSession ||
  mongoose.model<IAuthSessionDocument>("AuthSession", AuthSessionSchema);

export default AuthSession;
