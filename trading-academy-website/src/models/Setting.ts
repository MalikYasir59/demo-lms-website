import mongoose, { Schema, Model, Document } from "mongoose";
import { ISetting } from "@/types/lms";

export interface ISettingDocument
  extends Omit<ISetting, "_id">,
    Document {}

const SettingSchema = new Schema<ISettingDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Setting: Model<ISettingDocument> =
  mongoose.models.Setting ||
  mongoose.model<ISettingDocument>("Setting", SettingSchema);
