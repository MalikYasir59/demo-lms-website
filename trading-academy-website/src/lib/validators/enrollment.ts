import { z } from "zod";
import { objectIdSchema, paginationQuerySchema } from "./common";
import { ENROLLMENT_STATUS } from "../constants";

export const enrollStudentSchema = z.object({
  studentId: objectIdSchema,
  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().nullable().optional(),
  note: z.string().trim().max(500).optional(),
});

export const batchEnrollStudentsSchema = z.object({
  studentIds: z.array(objectIdSchema).min(1, "Select at least one student"),
  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().nullable().optional(),
  note: z.string().trim().max(500).optional(),
});

export const updateEnrollmentSchema = z.object({
  status: z
    .enum([
      ENROLLMENT_STATUS.ACTIVE,
      ENROLLMENT_STATUS.EXPIRED,
      ENROLLMENT_STATUS.SUSPENDED,
      ENROLLMENT_STATUS.REVOKED,
    ])
    .optional(),
  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().nullable().optional(),
  note: z.string().trim().max(500).optional(),
});

export const revokeEnrollmentSchema = z.object({
  reason: z.string().trim().min(2, "Reason must be at least 2 characters").max(500),
});

export const enrollmentQuerySchema = paginationQuerySchema.extend({
  status: z
    .enum([
      ENROLLMENT_STATUS.ACTIVE,
      ENROLLMENT_STATUS.EXPIRED,
      ENROLLMENT_STATUS.SUSPENDED,
      ENROLLMENT_STATUS.REVOKED,
    ])
    .optional(),
  studentId: objectIdSchema.optional(),
  courseId: objectIdSchema.optional(),
  search: z.string().trim().optional(),
});

export type EnrollStudentInput = z.infer<typeof enrollStudentSchema>;
export type BatchEnrollStudentsInput = z.infer<typeof batchEnrollStudentsSchema>;
export type UpdateEnrollmentInput = z.infer<typeof updateEnrollmentSchema>;
export type RevokeEnrollmentInput = z.infer<typeof revokeEnrollmentSchema>;
export type EnrollmentQueryInput = z.infer<typeof enrollmentQuerySchema>;
