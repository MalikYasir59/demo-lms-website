import mongoose, { Schema, Model, Document } from "mongoose";
import { ILectureProgress } from "@/types/lms";
import { PROGRESS_STATUS } from "@/lib/constants";

export interface ILectureProgressDocument
  extends Omit<ILectureProgress, "_id">,
    Document {}

const LectureProgressSchema = new Schema<ILectureProgressDocument>(
  {
    studentId: {
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
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    lectureId: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(PROGRESS_STATUS),
      default: PROGRESS_STATUS.IN_PROGRESS,
    },
    lastPositionSec: {
      type: Number,
      default: 0,
    },
    durationSec: {
      type: Number,
      default: 0,
    },
    watchedRanges: {
      type: [[Number]],
      default: [],
    },
    uniqueWatchedSec: {
      type: Number,
      default: 0,
    },
    percent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalWatchSec: {
      type: Number,
      default: 0,
    },
    playCount: {
      type: Number,
      default: 0,
    },
    firstWatchedAt: {
      type: Date,
      default: Date.now,
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes per spec 4.3.6
LectureProgressSchema.index({ studentId: 1, lectureId: 1 }, { unique: true });
LectureProgressSchema.index({ studentId: 1, courseId: 1 });
LectureProgressSchema.index({ courseId: 1, lectureId: 1, status: 1 });
LectureProgressSchema.index({ lastWatchedAt: -1 });

export const LectureProgress: Model<ILectureProgressDocument> =
  mongoose.models.LectureProgress ||
  mongoose.model<ILectureProgressDocument>(
    "LectureProgress",
    LectureProgressSchema,
    "lecture_progress"
  );

export default LectureProgress;
