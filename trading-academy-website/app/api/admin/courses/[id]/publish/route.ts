import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { publishCourse } from "@/services/course.service";

export const dynamic = "force-dynamic";

export const POST = withApi(
  {
    role: "admin",
  },
  async ({ req, auth, params }) => {
    const ip = getIp(req);
    return await publishCourse(params.id, auth!.id, ip);
  }
);
