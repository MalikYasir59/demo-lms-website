import { withApi } from "@/lib/api";
import { processHeartbeat } from "@/services/playback.service";
import { z } from "zod";
import { objectIdSchema } from "@/lib/validators/common";

const heartbeatSchema = z.object({
  psid: objectIdSchema,
  lectureId: objectIdSchema,
  from: z.number().min(0),
  pos: z.number().min(0),
  rate: z.number().min(0.25).max(4).optional().default(1),
  state: z.string().optional().default("playing"),
});

export const dynamic = "force-dynamic";

export const POST = withApi(
  {
    role: "student",
    schema: heartbeatSchema,
  },
  async ({ body, auth }) => {
    return await processHeartbeat({
      psid: body.psid,
      lectureId: body.lectureId,
      from: body.from,
      pos: body.pos,
      rate: body.rate,
      state: body.state,
      studentId: auth!.id,
    });
  }
);
