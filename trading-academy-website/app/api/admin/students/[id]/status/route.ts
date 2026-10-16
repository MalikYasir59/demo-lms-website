import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { changeStatusSchema } from "@/lib/validators/student";
import { changeStudentStatus } from "@/services/student.service";

export const dynamic = "force-dynamic";

export const PATCH = withApi(
  {
    role: "admin",
    schema: changeStatusSchema,
  },
  async ({ req, body, auth, params }) => {
    const ip = getIp(req);
    return await changeStudentStatus(
      params.id,
      body.status,
      body.reason,
      auth!.id,
      ip
    );
  }
);
