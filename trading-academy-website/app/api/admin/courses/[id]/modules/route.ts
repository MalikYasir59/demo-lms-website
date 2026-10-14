import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { createModuleSchema } from "@/lib/validators/course";
import { createModule } from "@/services/course.service";

export const dynamic = "force-dynamic";

export const POST = withApi(
  {
    role: "admin",
    schema: createModuleSchema,
  },
  async ({ req, body, auth, params }) => {
    const ip = getIp(req);
    return await createModule(params.id, body, auth!.id, ip);
  }
);
