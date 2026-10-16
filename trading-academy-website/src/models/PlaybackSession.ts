import mongoose, { Schema, Model, Document } from "mongoose";
import { IPlaybackSession } from "@/types/lms";

export interface IPlaybackSessionDocument
  extends Omit<IPlaybackSession, "_id">,
    Document {}

const PlaybackSessionSchema = new Schema<IPlaybackSessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    lectureId: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
      index: true,
    },
    sid: {
      type: String,
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    lastHeartbeatAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    endReason: {
      type: String,
      default: "",
    },
    watchedSec: {
      type: Number,
      default: 0,
    },
    maxRate: {
      type: Number,
      default: 1,
    },
    startPos: {
      type: Number,
      default: 0,
    },
    endPos: {
      type: Number,
      default: 0,
    },
    anomalies: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Compound indexes per spec 4.3.7
PlaybackSessionSchema.index({ userId: 1, startedAt: -1 });
PlaybackSessionSchema.index({ userId: 1, endedAt: 1, lastHeartbeatAt: -1 });
PlaybackSessionSchema.index({ lectureId: 1, startedAt: -1 });
PlaybackSessionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 180 * 24 * 3600 }
);

export const PlaybackSession: Model<IPlaybackSessionDocument> =
  mongoose.models.PlaybackSession ||
  mongoose.model<IPlaybackSessionDocument>(
    "PlaybackSession",
    PlaybackSessionSchema,
    "playback_sessions"
  );

export default PlaybackSession;
