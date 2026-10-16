import mongoose, { Schema, Model, Document } from "mongoose";
import { ISecurityEvent } from "@/types/lms";
import { SECURITY_SEVERITY } from "@/lib/constants";

export interface ISecurityEventDocument
  extends Omit<ISecurityEvent, "_id">,
    Document {}

const SecurityEventSchema = new Schema<ISecurityEventDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sid: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: Object.values(SECURITY_SEVERITY),
      default: SECURITY_SEVERITY.INFO,
      index: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    lectureId: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
      default: null,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    ip: {
      type: String,
      default: "127.0.0.1",
    },
    ua: {
      type: String,
      default: "",
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
    resolved: {
      by: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      at: {
        type: Date,
        default: null,
      },
      note: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes per spec 4.3.7
SecurityEventSchema.index({ userId: 1, createdAt: -1 });
SecurityEventSchema.index({ type: 1, createdAt: -1 });
SecurityEventSchema.index({ severity: 1, "resolved.at": 1 });
SecurityEventSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 365 * 24 * 3600 }
);

export const SecurityEvent: Model<ISecurityEventDocument> =
  mongoose.models.SecurityEvent ||
  mongoose.model<ISecurityEventDocument>(
    "SecurityEvent",
    SecurityEventSchema,
    "security_events"
  );

export default SecurityEvent;
