import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { createLectureSchema } from "@/lib/validators/course";
import { createLecture } from "@/services/course.service";

export const dynamic = "force-dynamic";

export const POST = withApi(
  {
    role: "admin",
    schema: createLectureSchema,
  },
  async ({ req, body, auth, params }) => {
    const ip = getIp(req);
    return await createLecture(params.id, body.moduleId, body, auth!.id, ip);
  }
);
