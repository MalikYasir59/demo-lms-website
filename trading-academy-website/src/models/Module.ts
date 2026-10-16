import mongoose, { Schema, Model, Document } from "mongoose";
import { IModule } from "@/types/lms";
import { MODULE_STATUS } from "@/lib/constants";

export interface IModuleDocument
  extends Omit<IModule, "_id">,
    Document {}

const ModuleSchema = new Schema<IModuleDocument>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
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
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(MODULE_STATUS),
      default: MODULE_STATUS.DRAFT,
    },
    drip: {
      unlockAfterDays: {
        type: Number,
        default: null,
      },
      unlockAt: {
        type: Date,
        default: null,
      },
    },
    stats: {
      lectureCount: { type: Number, default: 0 },
      durationSec: { type: Number, default: 0 },
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

// Compound index for ordered modules within a course
ModuleSchema.index({ courseId: 1, order: 1 });

export const Module: Model<IModuleDocument> =
  mongoose.models.Module ||
  mongoose.model<IModuleDocument>("Module", ModuleSchema);

export default Module;
