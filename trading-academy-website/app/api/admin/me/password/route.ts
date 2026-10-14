import { withApi } from "@/lib/api";
import { User } from "@/models/User";
import { AuthSession } from "@/models/AuthSession";
import { ApiError } from "@/lib/errors";
import { recordAuditLog } from "@/services/audit.service";
import { getIp } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const dynamic = "force-dynamic";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(12, "New password must be at least 12 characters"),
});

export const POST = withApi(
  {
    role: "admin",
    schema: changePasswordSchema,
  },
  async ({ req, body, auth }) => {
    const admin = await User.findById(auth!.id).select("+passwordHash");
    if (!admin) {
      throw ApiError.notFound("Admin account not found");
    }

    const matches = await bcrypt.compare(
      body.currentPassword,
      admin.passwordHash || ""
    );
    if (!matches) {
      throw ApiError.unauthorized("Current password does not match");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(body.newPassword, salt);
    admin.passwordHash = newHash;
    await admin.save();

    // Revoke all other admin sessions except current session
    await AuthSession.updateMany(
      {
        userId: admin._id,
        sid: { $ne: auth!.sid },
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
          revokedReason: "password_reset",
        },
      }
    );

    const ip = getIp(req);
    await recordAuditLog({
      actorId: String(admin._id),
      action: "admin.password.change",
      entityType: "user",
      entityId: String(admin._id),
      summary: "Admin changed password and revoked other active sessions",
      ip,
    });

    return { success: true, message: "Password updated successfully" };
  }
);
