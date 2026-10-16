import { withApi } from "@/lib/api";
import { endPlaybackSession } from "@/services/playback.service";
import { z } from "zod";
import { objectIdSchema } from "@/lib/validators/common";

const endSessionSchema = z.object({
  psid: objectIdSchema,
  reason: z.string().trim().optional(),
});

export const dynamic = "force-dynamic";

export const POST = withApi(
  {
    role: "student",
    schema: endSessionSchema,
  },
  async ({ body, auth }) => {
    return await endPlaybackSession({
      psid: body.psid,
      studentId: auth!.id,
      reason: body.reason,
    });
  }
);
