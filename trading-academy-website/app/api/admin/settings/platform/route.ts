import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { getPlatformSettings, updatePlatformSettings } from "@/services/setting.service";
import { z } from "zod";

export const dynamic = "force-dynamic";

const platformSettingsSchema = z.object({
  security: z
    .object({
      maxStudentDevices: z.number().min(1).max(5).optional(),
      maxAdminDevices: z.number().min(1).max(10).optional(),
      sessionLifetimeHours: z.number().min(1).max(72).optional(),
      idleTimeoutHours: z.number().min(1).max(24).optional(),
      strikeThresholds: z
        .object({
          warn: z.number().min(1).max(10).optional(),
          logout: z.number().min(2).max(20).optional(),
          lock: z.number().min(5).max(50).optional(),
        })
        .optional(),
      devtoolsGuardEnabled: z.boolean().optional(),
    })
    .optional(),
  defaults: z
    .object({
      accessDurationDays: z.number().min(1).max(3650).optional(),
      completionThreshold: z.number().min(50).max(100).optional(),
      allowSeekAhead: z.boolean().optional(),
    })
    .optional(),
  site: z
    .object({
      supportPhone: z.string().optional(),
      supportEmail: z.string().email().optional(),
    })
    .optional(),
});

export const GET = withApi(
  {
    role: "admin",
  },
  async () => {
    return await getPlatformSettings();
  }
);

export const PATCH = withApi(
  {
    role: "admin",
    schema: platformSettingsSchema,
  },
  async ({ req, body, auth }) => {
    const ip = getIp(req);
    return await updatePlatformSettings(body, auth!.id, ip);
  }
);
