import { withApi } from "@/lib/api";
import { getIp, getUA } from "@/lib/auth";
import { requestPlaybackTicket } from "@/services/playback.service";
import { z } from "zod";
import { objectIdSchema } from "@/lib/validators/common";

const ticketRequestSchema = z.object({
  lectureId: objectIdSchema,
  deviceId: z.string().trim().optional(),
});

export const dynamic = "force-dynamic";

export const POST = withApi(
  {
    role: "student",
    schema: ticketRequestSchema,
  },
  async ({ req, body, auth }) => {
    const ip = getIp(req);
    const ua = getUA(req);

    return await requestPlaybackTicket({
      studentId: auth!.id,
      sid: auth!.sid,
      lectureId: body.lectureId,
      deviceId: body.deviceId,
      ip,
      ua,
    });
  }
);
