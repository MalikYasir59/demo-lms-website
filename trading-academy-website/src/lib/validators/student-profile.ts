import { z } from "zod";

export const updateStudentProfileSchema = z.object({
  profile: z.object({
    dob: z.coerce.date().optional(),
    gender: z.string().trim().max(30).optional(),
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
  }),
});

export type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileSchema>;
