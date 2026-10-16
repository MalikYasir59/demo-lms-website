import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import {
  getStudentEnrollments,
  enrollStudent,
} from "@/services/enrollment.service";
import { z } from "zod";
import { objectIdSchema } from "@/lib/validators/common";

const directEnrollSchema = z.object({
  courseId: objectIdSchema,
  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().nullable().optional(),
  note: z.string().trim().max(500).optional(),
});

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async ({ req, params }) => {
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || undefined;
    return await getStudentEnrollments(params.id, { status });
  }
);

export const POST = withApi(
  {
    role: "admin",
    schema: directEnrollSchema,
  },
  async ({ req, body, auth, params }) => {
    const ip = getIp(req);
    return await enrollStudent(
      body.courseId,
      {
        studentId: params.id,
        startsAt: body.startsAt,
        expiresAt: body.expiresAt,
        note: body.note,
      },
      auth!.id,
      ip
    );
  }
);
