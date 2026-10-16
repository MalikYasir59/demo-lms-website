import mongoose, { Schema, Model, Document } from "mongoose";
import { IEnrollment } from "@/types/lms";
import { ENROLLMENT_STATUS } from "@/lib/constants";

export interface IEnrollmentDocument
  extends Omit<IEnrollment, "_id">,
    Document {}

const EnrollmentSchema = new Schema<IEnrollmentDocument>(
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
    status: {
      type: String,
      enum: Object.values(ENROLLMENT_STATUS),
      default: ENROLLMENT_STATUS.ACTIVE,
      index: true,
    },
    startsAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      enum: ["admin", "import"],
      default: "admin",
    },
    grantedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    progress: {
      completedLectures: { type: Number, default: 0 },
      totalLectures: { type: Number, default: 0 },
      percent: { type: Number, default: 0 },
      lastLectureId: {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
        default: null,
      },
      lastActivityAt: { type: Date, default: null },
    },
    completedAt: {
      type: Date,
      default: null,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    revokeReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
EnrollmentSchema.index({ courseId: 1, status: 1 });
EnrollmentSchema.index({ status: 1, expiresAt: 1 });
EnrollmentSchema.index({ studentId: 1, status: 1 });

export const Enrollment: Model<IEnrollmentDocument> =
  mongoose.models.Enrollment ||
  mongoose.model<IEnrollmentDocument>("Enrollment", EnrollmentSchema);

export default Enrollment;
