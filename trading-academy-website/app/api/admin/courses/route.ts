import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { createCourseSchema, courseQuerySchema } from "@/lib/validators/course";
import { createCourse, listCourses } from "@/services/course.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async ({ req }) => {
    const { searchParams } = new URL(req.url);
    const parsedQuery = courseQuerySchema.parse({
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      sort: searchParams.get("sort") || undefined,
      order: searchParams.get("order") || undefined,
      q: searchParams.get("q") || undefined,
      status: searchParams.get("status") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      difficulty: searchParams.get("difficulty") || undefined,
    });

    return await listCourses(parsedQuery);
  }
);

export const POST = withApi(
  {
    role: "admin",
    schema: createCourseSchema,
  },
  async ({ req, body, auth }) => {
    const ip = getIp(req);
    return await createCourse(body, auth!.id, ip);
  }
);
