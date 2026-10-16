import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import {
  getStudentSessions,
  revokeStudentSessions,
} from "@/services/student.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async ({ params }) => {
    return await getStudentSessions(params.id);
  }
);

export const DELETE = withApi(
  {
    role: "admin",
  },
  async ({ req, auth, params }) => {
    const { searchParams } = new URL(req.url);
    const sid = searchParams.get("sid") || undefined;
    const ip = getIp(req);
    return await revokeStudentSessions(params.id, sid, auth!.id, ip);
  }
);
