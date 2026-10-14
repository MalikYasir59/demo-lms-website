import { withApi } from "@/lib/api";
import { getIp, getUA } from "@/lib/auth";
import { reportSecurityEvent } from "@/services/playback.service";
import { z } from "zod";
import { objectIdSchema } from "@/lib/validators/common";

const securityEventSchema = z.object({
  type: z.string().trim().min(1),
  lectureId: objectIdSchema.optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const dynamic = "force-dynamic";

export const POST = withApi(
  {
    role: "student",
    schema: securityEventSchema,
  },
  async ({ req, body, auth }) => {
    const ip = getIp(req);
    const ua = getUA(req);

    return await reportSecurityEvent({
      userId: auth!.id,
      sid: auth!.sid,
      type: body.type,
      lectureId: body.lectureId,
      meta: body.meta,
      ip,
      ua,
    });
  }
);
