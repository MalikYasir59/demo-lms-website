import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import {
  getCourseEnrollments,
  enrollStudent,
  batchEnrollStudents,
} from "@/services/enrollment.service";
import {
  enrollStudentSchema,
  batchEnrollStudentsSchema,
  enrollmentQuerySchema,
} from "@/lib/validators/enrollment";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async ({ req, params }) => {
    const url = new URL(req.url);
    const rawQuery = {
      page: url.searchParams.get("page") || 1,
      limit: url.searchParams.get("limit") || 20,
      status: url.searchParams.get("status") || undefined,
      search: url.searchParams.get("search") || undefined,
    };

    const query = enrollmentQuerySchema.parse(rawQuery);
    return await getCourseEnrollments(params.id, query);
  }
);

export const POST = withApi(
  {
    role: "admin",
  },
  async ({ req, auth, params }) => {
    const body = await req.json();
    const ip = getIp(req);

    if (Array.isArray(body.studentIds)) {
      const data = batchEnrollStudentsSchema.parse(body);
      return await batchEnrollStudents(
        params.id,
        data.studentIds,
        {
          startsAt: data.startsAt,
          expiresAt: data.expiresAt,
          note: data.note,
        },
        auth!.id,
        ip
      );
    }

    const data = enrollStudentSchema.parse(body);
    return await enrollStudent(params.id, data, auth!.id, ip);
  }
);
