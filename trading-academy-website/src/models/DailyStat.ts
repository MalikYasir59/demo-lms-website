import mongoose, { Schema, Model, Document } from "mongoose";
import { IDailyStat } from "@/types/lms";

export interface IDailyStatDocument
  extends Omit<IDailyStat, "_id">,
    Document {}

const DailyStatSchema = new Schema<IDailyStatDocument>(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    scope: {
      type: String,
      enum: ["platform", "course", "student", "lecture"],
      required: true,
      index: true,
    },
    refId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    metrics: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index per date, scope, and entity
DailyStatSchema.index({ date: 1, scope: 1, refId: 1 }, { unique: true });
DailyStatSchema.index({ scope: 1, date: -1 });

export const DailyStat: Model<IDailyStatDocument> =
  mongoose.models.DailyStat ||
  mongoose.model<IDailyStatDocument>("DailyStat", DailyStatSchema);
