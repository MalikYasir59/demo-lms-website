import { withApi } from "@/lib/api";
import { getIp, getUA } from "@/lib/auth";
import { redeemPlaybackTicket } from "@/services/playback.service";
import { z } from "zod";

const redeemTicketSchema = z.object({
  ticket: z.string().trim().min(1, "Ticket token required"),
  nonce: z.string().trim().optional(),
});

export const dynamic = "force-dynamic";

export const POST = withApi(
  {
    role: "student",
    schema: redeemTicketSchema,
  },
  async ({ req, body }) => {
    const ip = getIp(req);
    const ua = getUA(req);

    return await redeemPlaybackTicket({
      ticket: body.ticket,
      nonce: body.nonce,
      ip,
      ua,
    });
  }
);
