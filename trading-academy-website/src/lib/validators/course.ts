import { z } from "zod";
import { objectIdSchema, paginationQuerySchema } from "./common";
import { COURSE_STATUS, MODULE_STATUS, LECTURE_STATUS, DRIP_MODES, DIFFICULTY_LEVELS } from "../constants";

// Slug generator helper
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// Category Schemas
export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  slug: z.string().trim().optional(),
  description: z.string().trim().max(500).optional(),
  color: z.string().trim().default("#6366f1"),
  order: z.coerce.number().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

// Author Schemas
export const createAuthorSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().optional(),
  title: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(2000).optional(),
  social: z
    .object({
      website: z.string().trim().optional(),
      linkedin: z.string().trim().optional(),
      youtube: z.string().trim().optional(),
      x: z.string().trim().optional(),
    })
    .optional(),
  isActive: z.boolean().default(true),
});

export const updateAuthorSchema = createAuthorSchema.partial();

// Course Schemas
export const createCourseSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(160),
  slug: z.string().trim().optional(),
  subtitle: z.string().trim().max(300).optional(),
  description: z.string().trim().default(""),
  thumbnail: z
    .object({
      key: z.string().optional(),
      url: z.string(),
    })
    .optional(),
  introVideoUrl: z.string().trim().optional(),
  categoryIds: z.array(objectIdSchema).default([]),
  authorId: objectIdSchema.optional().nullable(),
  tags: z.array(z.string().trim()).default([]),
  difficulty: z.enum(Object.values(DIFFICULTY_LEVELS) as [string, ...string[]]).default("all"),
  language: z.string().default("English"),
  learningOutcomes: z.array(z.string().trim()).default([]),
  requirements: z.array(z.string().trim()).default([]),
  audience: z.array(z.string().trim()).default([]),
  showOnPublicSite: z.boolean().default(true),
});

export const updateCourseSchema = createCourseSchema.partial().extend({
  status: z.enum(Object.values(COURSE_STATUS) as [string, ...string[]]).optional(),
  settings: z
    .object({
      drip: z.object({
        mode: z.enum(Object.values(DRIP_MODES) as [string, ...string[]]).default("none"),
      }),
      accessDays: z.coerce.number().nullable().optional(),
      maxStudents: z.coerce.number().nullable().optional(),
      completionThreshold: z.coerce.number().min(1).max(100).default(90),
      allowSeekAhead: z.boolean().default(true),
      allowedRates: z.array(z.number()).default([0.75, 1, 1.25, 1.5, 2]),
    })
    .optional(),
});

// Module Schemas
export const createModuleSchema = z.object({
  title: z.string().trim().min(2, "Module title is required").max(160),
  description: z.string().trim().default(""),
  order: z.coerce.number().default(0),
  status: z.enum(Object.values(MODULE_STATUS) as [string, ...string[]]).default("draft"),
  drip: z
    .object({
      unlockAfterDays: z.coerce.number().nullable().optional(),
      unlockAt: z.coerce.date().nullable().optional(),
    })
    .optional(),
});

export const updateModuleSchema = createModuleSchema.partial();

// Lecture Schemas
export const createLectureSchema = z.object({
  moduleId: objectIdSchema,
  title: z.string().trim().min(2, "Lecture title is required").max(160),
  description: z.string().trim().max(5000).default(""),
  order: z.coerce.number().default(0),
  status: z.enum(Object.values(LECTURE_STATUS) as [string, ...string[]]).default("draft"),
  videoUrlOrId: z.string().trim().min(1, "YouTube video link or ID is required"),
  durationSec: z.coerce.number().default(0),
  drip: z
    .object({
      unlockAfterDays: z.coerce.number().nullable().optional(),
    })
    .optional(),
});

export const updateLectureSchema = createLectureSchema.partial().extend({
  videoUrlOrId: z.string().trim().optional(),
});

// Reorder Schema
export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: objectIdSchema,
      order: z.coerce.number(),
    })
  ).min(1, "At least one item must be provided"),
});

// Video Validation Schema
export const validateVideoSchema = z.object({
  videoUrlOrId: z.string().trim().min(1, "Please provide a YouTube video URL or ID"),
});

// Course Query Schema
export const courseQuerySchema = paginationQuerySchema.extend({
  status: z.enum(["draft", "published", "archived", "all"]).default("all"),
  categoryId: objectIdSchema.optional(),
  authorId: objectIdSchema.optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced", "all"]).default("all"),
});
