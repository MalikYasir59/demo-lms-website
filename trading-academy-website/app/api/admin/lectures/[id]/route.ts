import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { updateLectureSchema } from "@/lib/validators/course";
import { updateLecture, deleteLecture } from "@/services/course.service";

export const dynamic = "force-dynamic";

export const PATCH = withApi(
  {
    role: "admin",
    schema: updateLectureSchema,
  },
  async ({ req, body, auth, params }) => {
    const ip = getIp(req);
    return await updateLecture(params.id, body, auth!.id, ip);
  }
);

export const DELETE = withApi(
  {
    role: "admin",
  },
  async ({ req, auth, params }) => {
    const ip = getIp(req);
    return await deleteLecture(params.id, auth!.id, ip);
  }
);
