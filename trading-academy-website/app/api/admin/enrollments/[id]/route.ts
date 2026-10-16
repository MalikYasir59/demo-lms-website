import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { updateEnrollment, revokeEnrollment } from "@/services/enrollment.service";
import {
  updateEnrollmentSchema,
  revokeEnrollmentSchema,
} from "@/lib/validators/enrollment";

export const dynamic = "force-dynamic";

export const PATCH = withApi(
  {
    role: "admin",
    schema: updateEnrollmentSchema,
  },
  async ({ req, body, auth, params }) => {
    const ip = getIp(req);
    return await updateEnrollment(params.id, body, auth!.id, ip);
  }
);

export const DELETE = withApi(
  {
    role: "admin",
  },
  async ({ req, auth, params }) => {
    const ip = getIp(req);
    let reason = "Revoked by administrator";
    try {
      const body = await req.json();
      if (body) {
        const parsed = revokeEnrollmentSchema.parse(body);
        reason = parsed.reason;
      }
    } catch {
      // If no valid body, default reason applies
    }

    return await revokeEnrollment(params.id, reason, auth!.id, ip);
  }
);
