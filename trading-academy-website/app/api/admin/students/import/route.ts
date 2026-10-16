import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { z } from "zod";
import { createStudent } from "@/services/student.service";

export const dynamic = "force-dynamic";

const studentImportRowSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email().toLowerCase(),
  phone: z.string().trim().optional(),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  customPassword: z.string().min(8).optional(),
});

const importBatchSchema = z.object({
  students: z.array(studentImportRowSchema).min(1, "No students provided for import"),
});

export const POST = withApi(
  {
    role: "admin",
    schema: importBatchSchema,
  },
  async ({ req, body, auth }) => {
    const ip = getIp(req);
    const results: Array<{
      studentCode: string;
      name: string;
      email: string;
      password: string;
    }> = [];
    const errors: Array<{ email: string; reason: string }> = [];

    for (const row of body.students) {
      try {
        const { student, temporaryPassword } = await createStudent(
          {
            name: row.name,
            email: row.email,
            phone: row.phone,
            customPassword: row.customPassword,
            profile: {
              experienceLevel: row.experienceLevel || "beginner",
              source: "bulk_import",
            },
          },
          auth!.id,
          ip
        );

        results.push({
          studentCode: student.studentCode || "",
          name: student.name,
          email: student.email,
          password: temporaryPassword,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Creation failed";
        errors.push({ email: row.email, reason: msg });
      }
    }

    return {
      importedCount: results.length,
      failedCount: errors.length,
      credentials: results,
      errors,
    };
  }
);
