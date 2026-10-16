import { z } from "zod";
import { PAGINATION } from "../constants";

// ObjectId validator
export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

// Pagination and search query schema
export const paginationQuerySchema = z.object({
  page: z
    .coerce
    .number()
    .int()
    .min(1)
    .default(PAGINATION.DEFAULT_PAGE),
  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(PAGINATION.MAX_LIMIT)
    .default(PAGINATION.DEFAULT_LIMIT),
  sort: z.string().trim().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
  q: z.string().trim().max(100).optional(),
});

// Safe string without MongoDB operator injection ($ prefix)
export const safeStringSchema = z
  .string()
  .trim()
  .refine((val) => !val.startsWith("$"), {
    message: "Input cannot start with prohibited operator '$'",
  });

// Date coercion schema
export const dateSchema = z.coerce.date();

// Phone schema with E.164 pattern or general international format
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number (must follow E.164 format, e.g. +923001234567)")
  .optional()
  .or(z.literal(""));

// Helper to strip dangerous MongoDB operators from any object
export function sanitizeMongoInput<T>(input: T): T {
  if (input === null || typeof input !== "object") {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeMongoInput) as unknown as T;
  }

  const cleanObj: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(input)) {
    if (key.startsWith("$")) {
      continue; // drop operator keys
    }
    cleanObj[key] = sanitizeMongoInput(val);
  }
  return cleanObj as T;
}
