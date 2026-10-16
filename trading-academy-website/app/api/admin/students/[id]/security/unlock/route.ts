import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { unlockStudentSecurity } from "@/services/student.service";

export const dynamic = "force-dynamic";

export const POST = withApi(
  {
    role: "admin",
  },
  async ({ req, auth, params }) => {
    const ip = getIp(req);
    return await unlockStudentSecurity(params.id, auth!.id, ip);
  }
);
