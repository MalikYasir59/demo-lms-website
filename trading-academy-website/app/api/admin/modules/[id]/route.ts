import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { updateModuleSchema } from "@/lib/validators/course";
import { updateModule, deleteModule } from "@/services/course.service";

export const dynamic = "force-dynamic";

export const PATCH = withApi(
  {
    role: "admin",
    schema: updateModuleSchema,
  },
  async ({ req, body, auth, params }) => {
    const ip = getIp(req);
    return await updateModule(params.id, body, auth!.id, ip);
  }
);

export const DELETE = withApi(
  {
    role: "admin",
  },
  async ({ req, auth, params }) => {
    const ip = getIp(req);
    return await deleteModule(params.id, auth!.id, ip);
  }
);
