import { z } from "zod";
import { paginationQuerySchema, objectIdSchema, phoneSchema } from "./common";
import { USER_STATUS } from "../constants";

export const createStudentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  phone: phoneSchema,
  customPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
  profile: z
    .object({
      dob: z.coerce.date().optional(),
      gender: z.string().trim().max(30).optional(),
      idNumber: z.string().trim().max(50).optional(),
      address: z
        .object({
          line1: z.string().trim().max(120).optional(),
          line2: z.string().trim().max(120).optional(),
          city: z.string().trim().max(60).optional(),
          state: z.string().trim().max(60).optional(),
          country: z.string().trim().max(60).default("Pakistan"),
          postalCode: z.string().trim().max(20).optional(),
        })
        .optional(),
      education: z.string().trim().max(100).optional(),
      occupation: z.string().trim().max(100).optional(),
      experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      emergencyContact: z
        .object({
          name: z.string().trim().max(100).optional(),
          phone: z.string().trim().max(30).optional(),
          relation: z.string().trim().max(50).optional(),
        })
        .optional(),
      source: z.string().trim().max(100).optional(),
      tags: z.array(z.string().trim().max(30)).optional(),
    })
    .optional(),
  adminNotes: z.string().trim().max(5000).optional(),
  courseIds: z.array(objectIdSchema).optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

export const updateStudentSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  phone: phoneSchema,
  profile: z
    .object({
      dob: z.coerce.date().optional(),
      gender: z.string().trim().max(30).optional(),
      idNumber: z.string().trim().max(50).optional(),
      address: z
        .object({
          line1: z.string().trim().max(120).optional(),
          line2: z.string().trim().max(120).optional(),
          city: z.string().trim().max(60).optional(),
          state: z.string().trim().max(60).optional(),
          country: z.string().trim().max(60).optional(),
          postalCode: z.string().trim().max(20).optional(),
        })
        .optional(),
      education: z.string().trim().max(100).optional(),
      occupation: z.string().trim().max(100).optional(),
      experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      emergencyContact: z
        .object({
          name: z.string().trim().max(100).optional(),
          phone: z.string().trim().max(30).optional(),
          relation: z.string().trim().max(50).optional(),
        })
        .optional(),
      source: z.string().trim().max(100).optional(),
      tags: z.array(z.string().trim().max(30)).optional(),
    })
    .optional(),
  adminNotes: z.string().trim().max(5000).optional(),
});

export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;

export const changeStatusSchema = z.object({
  status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.INACTIVE, USER_STATUS.SUSPENDED]),
  reason: z.string().trim().max(500).optional(),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
});

export const bulkActionSchema = z.object({
  studentIds: z.array(objectIdSchema).min(1, "Select at least one student"),
  action: z.enum(["activate", "suspend", "delete", "add_tag", "remove_tag"]),
  tag: z.string().trim().max(30).optional(),
});

export const studentQuerySchema = paginationQuerySchema.extend({
  status: z.enum(["active", "inactive", "suspended", "all"]).default("all"),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced", "all"]).default("all"),
  tag: z.string().trim().optional(),
});
