import mongoose, { Schema, Model, Document } from "mongoose";
import { ILecture } from "@/types/lms";
import { LECTURE_STATUS } from "@/lib/constants";

export interface ILectureDocument
  extends Omit<ILecture, "_id">,
    Document {}

const LectureSchema = new Schema<ILectureDocument>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      maxlength: 5000,
      default: "",
    },
    notesHtml: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    type: {
      type: String,
      enum: ["video"],
      default: "video",
    },
    status: {
      type: String,
      enum: Object.values(LECTURE_STATUS),
      default: LECTURE_STATUS.DRAFT,
    },
    video: {
      provider: {
        type: String,
        enum: ["youtube"],
        default: "youtube",
      },
      ref: {
        type: {
          enc: { type: String, required: true },
          iv: { type: String, required: true },
          tag: { type: String, required: true },
        },
        select: false, // Critical security rule: never selected by default
      },
      hmac: {
        type: String,
        index: true,
      },
      durationSec: {
        type: Number,
        default: 0,
      },
      sourceTitle: {
        type: String,
        default: "",
      },
      verifiedAt: {
        type: Date,
        default: null,
      },
      version: {
        type: Number,
        default: 1,
      },
    },
    resources: [
      {
        title: { type: String, required: true },
        fileKey: { type: String, required: true },
        originalName: { type: String, default: "" },
        storedName: { type: String, default: "" },
        mime: { type: String, default: "application/pdf" },
        size: { type: Number, default: 0 },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    drip: {
      unlockAfterDays: {
        type: Number,
        default: null,
      },
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes per spec 4.3.4
LectureSchema.index({ moduleId: 1, order: 1 });
LectureSchema.index({ "video.hmac": 1 });

export const Lecture: Model<ILectureDocument> =
  mongoose.models.Lecture ||
  mongoose.model<ILectureDocument>("Lecture", LectureSchema);

export default Lecture;
