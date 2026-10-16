import mongoose, { Schema, Model, Document } from "mongoose";
import { ILectureStat } from "@/types/lms";

export interface ILectureStatDocument
  extends Omit<ILectureStat, "_id">,
    Document {}

const LectureStatSchema = new Schema<ILectureStatDocument>(
  {
    lectureId: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
      unique: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    viewers: {
      type: Number,
      default: 0,
    },
    completions: {
      type: Number,
      default: 0,
    },
    avgWatchPct: {
      type: Number,
      default: 0,
    },
    dropoffPct: {
      type: Number,
      default: 0,
    },
    heat: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

LectureStatSchema.index({ courseId: 1, viewers: -1 });

export const LectureStat: Model<ILectureStatDocument> =
  mongoose.models.LectureStat ||
  mongoose.model<ILectureStatDocument>("LectureStat", LectureStatSchema);
