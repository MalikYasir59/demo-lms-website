import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { z } from "zod";
import { objectIdSchema } from "@/lib/validators/common";
import { reorderLectures } from "@/services/course.service";

export const dynamic = "force-dynamic";

const lectureReorderSchema = z.object({
  moduleId: objectIdSchema,
  items: z.array(
    z.object({
      id: objectIdSchema,
      order: z.coerce.number(),
    })
  ).min(1),
});

export const POST = withApi(
  {
    role: "admin",
    schema: lectureReorderSchema,
  },
  async ({ req, body, auth }) => {
    const ip = getIp(req);
    return await reorderLectures(body.moduleId, body.items, auth!.id, ip);
  }
);
