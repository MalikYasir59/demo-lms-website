import mongoose, { Schema, Model, Document } from "mongoose";
import { IPlaybackTicket } from "@/types/lms";

export interface IPlaybackTicketDocument
  extends Omit<IPlaybackTicket, "_id">,
    Document {}

const PlaybackTicketSchema = new Schema<IPlaybackTicketDocument>(
  {
    jti: {
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
    sid: {
      type: String,
      required: true,
    },
    lectureId: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
      index: true,
    },
    ipHash: {
      type: String,
      required: true,
    },
    uaHash: {
      type: String,
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const PlaybackTicket: Model<IPlaybackTicketDocument> =
  mongoose.models.PlaybackTicket ||
  mongoose.model<IPlaybackTicketDocument>(
    "PlaybackTicket",
    PlaybackTicketSchema,
    "playback_tickets"
  );

export default PlaybackTicket;
