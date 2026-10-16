import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { bulkActionSchema } from "@/lib/validators/student";
import { bulkStudentAction } from "@/services/student.service";

export const dynamic = "force-dynamic";

export const POST = withApi(
  {
    role: "admin",
    schema: bulkActionSchema,
  },
  async ({ req, body, auth }) => {
    const ip = getIp(req);
    return await bulkStudentAction(
      body.studentIds,
      body.action,
      body.tag,
      auth!.id,
      ip
    );
  }
);
