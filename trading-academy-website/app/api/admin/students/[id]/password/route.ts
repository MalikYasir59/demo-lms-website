import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validators/student";
import { resetStudentPassword } from "@/services/student.service";

export const dynamic = "force-dynamic";

export const POST = withApi(
  {
    role: "admin",
    schema: resetPasswordSchema,
  },
  async ({ req, body, auth, params }) => {
    const ip = getIp(req);
    return await resetStudentPassword(params.id, body?.password, auth!.id, ip);
  }
);
