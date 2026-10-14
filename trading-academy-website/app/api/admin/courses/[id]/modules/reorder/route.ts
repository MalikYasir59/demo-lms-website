import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { reorderSchema } from "@/lib/validators/course";
import { reorderModules } from "@/services/course.service";

export const dynamic = "force-dynamic";

export const POST = withApi(
  {
    role: "admin",
    schema: reorderSchema,
  },
  async ({ req, body, auth, params }) => {
    const ip = getIp(req);
    return await reorderModules(params.id, body.items, auth!.id, ip);
  }
);
