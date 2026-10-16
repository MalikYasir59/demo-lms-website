import mongoose, { Schema, Model, Document } from "mongoose";
import { IUser } from "@/types/lms";
import { ROLES, USER_STATUS } from "@/lib/constants";

export interface IUserDocument extends Omit<IUser, "_id">, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      index: true,
    },
    studentCode: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    passwordUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
      index: true,
    },
    avatar: {
      key: { type: String },
      url: { type: String, default: "" },
      updatedAt: { type: Date },
    },
    profile: {
      dob: { type: Date },
      gender: { type: String, trim: true },
      idNumber: { type: String, trim: true },
      address: {
        line1: { type: String, trim: true },
        line2: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true, default: "Pakistan" },
        postalCode: { type: String, trim: true },
      },
      education: { type: String, trim: true },
      occupation: { type: String, trim: true },
      experienceLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
      },
      emergencyContact: {
        name: { type: String, trim: true },
        phone: { type: String, trim: true },
        relation: { type: String, trim: true },
      },
      source: { type: String, trim: true },
      tags: [{ type: String, trim: true }],
    },
    adminNotes: {
      type: String,
      default: "",
    },
    security: {
      failedLogins: { type: Number, default: 0 },
      lockedUntil: { type: Date, default: null },
      strikes: { type: Number, default: 0 },
      securityLocked: { type: Boolean, default: false },
      lockReason: { type: String, default: "" },
      lastStrikeAt: { type: Date, default: null },
    },
    acceptedTermsAt: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    lastLoginIp: {
      type: String,
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

// Compound and text indexes
UserSchema.index({ role: 1, status: 1, createdAt: -1 });
UserSchema.index(
  { name: "text", email: "text", phone: "text", studentCode: "text" },
  { name: "users_text_search" }
);

export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;
