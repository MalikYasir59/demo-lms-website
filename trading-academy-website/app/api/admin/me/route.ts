import { withApi } from "@/lib/api";
import { User } from "@/models/User";
import { ApiError } from "@/lib/errors";
import { recordAuditLog } from "@/services/audit.service";
import { getIp } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateMeSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export const GET = withApi(
  {
    role: "admin",
  },
  async ({ auth }) => {
    const admin = await User.findById(auth!.id)
      .select("name email phone role status avatar lastLoginAt createdAt")
      .lean();

    if (!admin) {
      throw ApiError.notFound("Admin profile not found");
    }

    return admin;
  }
);

export const PATCH = withApi(
  {
    role: "admin",
    schema: updateMeSchema,
  },
  async ({ req, body, auth }) => {
    const admin = await User.findById(auth!.id);
    if (!admin) {
      throw ApiError.notFound("Admin profile not found");
    }

    const before = { name: admin.name, email: admin.email, phone: admin.phone };

    if (body.name) admin.name = body.name;
    if (body.phone !== undefined) admin.phone = body.phone;
    if (body.email && body.email.toLowerCase() !== admin.email) {
      const existing = await User.findOne({
        email: body.email.toLowerCase(),
        _id: { $ne: admin._id },
        deletedAt: null,
      });
      if (existing) {
        throw ApiError.conflict("Email is already in use by another account");
      }
      admin.email = body.email.toLowerCase();
    }

    await admin.save();

    const ip = getIp(req);
    await recordAuditLog({
      actorId: String(admin._id),
      action: "admin.profile.update",
      entityType: "user",
      entityId: String(admin._id),
      summary: "Admin updated profile credentials",
      before,
      after: { name: admin.name, email: admin.email, phone: admin.phone },
      ip,
    });

    return {
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
    };
  }
);
