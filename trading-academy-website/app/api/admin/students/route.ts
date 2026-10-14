import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { createStudentSchema, studentQuerySchema } from "@/lib/validators/student";
import { createStudent, listStudents } from "@/services/student.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async ({ req }) => {
    const { searchParams } = new URL(req.url);
    const parsedQuery = studentQuerySchema.parse({
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      sort: searchParams.get("sort") || undefined,
      order: searchParams.get("order") || undefined,
      q: searchParams.get("q") || undefined,
      status: searchParams.get("status") || undefined,
      experienceLevel: searchParams.get("experienceLevel") || undefined,
      tag: searchParams.get("tag") || undefined,
    });

    return await listStudents(parsedQuery);
  }
);

export const POST = withApi(
  {
    role: "admin",
    schema: createStudentSchema,
  },
  async ({ req, body, auth }) => {
    const ip = getIp(req);
    return await createStudent(body, auth!.id, ip);
  }
);
