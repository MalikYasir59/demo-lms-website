import mongoose, { Schema, Model, Document } from "mongoose";
import { IAuthor } from "@/types/lms";

export interface IAuthorDocument
  extends Omit<IAuthor, "_id">,
    Document {}

const AuthorSchema = new Schema<IAuthorDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: "Senior Quantitative Trader",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      key: { type: String },
      url: { type: String, default: "" },
    },
    social: {
      website: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
      x: { type: String, default: "" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    courseCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Author: Model<IAuthorDocument> =
  mongoose.models.Author ||
  mongoose.model<IAuthorDocument>("Author", AuthorSchema);

export default Author;
