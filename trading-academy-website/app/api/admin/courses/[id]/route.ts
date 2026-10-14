import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { updateCourseSchema } from "@/lib/validators/course";
import {
  getCourseWithTree,
  updateCourse,
  softDeleteCourse,
} from "@/services/course.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async ({ params }) => {
    return await getCourseWithTree(params.id);
  }
);

export const PATCH = withApi(
  {
    role: "admin",
    schema: updateCourseSchema,
  },
  async ({ req, body, auth, params }) => {
    const ip = getIp(req);
    return await updateCourse(params.id, body, auth!.id, ip);
  }
);

export const DELETE = withApi(
  {
    role: "admin",
  },
  async ({ req, auth, params }) => {
    const ip = getIp(req);
    return await softDeleteCourse(params.id, auth!.id, ip);
  }
);
