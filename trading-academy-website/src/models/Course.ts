import mongoose, { Schema, Model, Document } from "mongoose";
import { ICourse } from "@/types/lms";
import {
  COURSE_STATUS,
  DRIP_MODES,
  DIFFICULTY_LEVELS,
} from "@/lib/constants";

export interface ICourseDocument
  extends Omit<ICourse, "_id">,
    Document {}

const CourseSchema = new Schema<ICourseDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      key: { type: String },
      url: { type: String, default: "" },
    },
    introVideoUrl: {
      type: String,
      default: "",
    },
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        index: true,
      },
    ],
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      index: true,
      default: null,
    },
    tags: [{ type: String, trim: true }],
    difficulty: {
      type: String,
      enum: Object.values(DIFFICULTY_LEVELS),
      default: DIFFICULTY_LEVELS.ALL,
    },
    language: {
      type: String,
      default: "English",
    },
    status: {
      type: String,
      enum: Object.values(COURSE_STATUS),
      default: COURSE_STATUS.DRAFT,
      index: true,
    },
    publishAt: {
      type: Date,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    showOnPublicSite: {
      type: Boolean,
      default: true,
    },
    learningOutcomes: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    audience: [{ type: String, trim: true }],
    settings: {
      drip: {
        mode: {
          type: String,
          enum: Object.values(DRIP_MODES),
          default: DRIP_MODES.NONE,
        },
      },
      accessDays: {
        type: Number,
        default: null,
      },
      maxStudents: {
        type: Number,
        default: null,
      },
      completionThreshold: {
        type: Number,
        default: 90,
      },
      allowSeekAhead: {
        type: Boolean,
        default: true,
      },
      allowedRates: {
        type: [Number],
        default: [0.75, 1, 1.25, 1.5, 2],
      },
    },
    stats: {
      moduleCount: { type: Number, default: 0 },
      lectureCount: { type: Number, default: 0 },
      totalDurationSec: { type: Number, default: 0 },
      enrolledCount: { type: Number, default: 0 },
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

// Compound indexes per spec 4.3.3
CourseSchema.index({ status: 1, publishAt: 1 });
CourseSchema.index({ title: "text", tags: "text" }, { name: "courses_text_search" });

export const Course: Model<ICourseDocument> =
  mongoose.models.Course ||
  mongoose.model<ICourseDocument>("Course", CourseSchema);

export default Course;
