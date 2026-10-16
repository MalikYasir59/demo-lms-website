import { connectToDatabase } from "@/lib/db";
import { Setting } from "@/models/Setting";
import { recordAuditLog } from "@/services/audit.service";

export interface PlatformSettings {
  security: {
    maxStudentDevices: number;
    maxAdminDevices: number;
    sessionLifetimeHours: number;
    idleTimeoutHours: number;
    strikeThresholds: {
      warn: number;
      logout: number;
      lock: number;
    };
    devtoolsGuardEnabled: boolean;
  };
  defaults: {
    accessDurationDays: number;
    completionThreshold: number;
    allowSeekAhead: boolean;
  };
  site: {
    supportPhone: string;
    supportEmail: string;
  };
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  security: {
    maxStudentDevices: 1,
    maxAdminDevices: 3,
    sessionLifetimeHours: 12,
    idleTimeoutHours: 2,
    strikeThresholds: {
      warn: 3,
      logout: 8,
      lock: 15,
    },
    devtoolsGuardEnabled: true,
  },
  defaults: {
    accessDurationDays: 365,
    completionThreshold: 85,
    allowSeekAhead: true,
  },
  site: {
    supportPhone: "+92 300 0000000",
    supportEmail: "support@instituteoftradingtricks.com",
  },
};

export interface UpdatePlatformSettingsInput {
  security?: {
    maxStudentDevices?: number;
    maxAdminDevices?: number;
    sessionLifetimeHours?: number;
    idleTimeoutHours?: number;
    strikeThresholds?: {
      warn?: number;
      logout?: number;
      lock?: number;
    };
    devtoolsGuardEnabled?: boolean;
  };
  defaults?: {
    accessDurationDays?: number;
    completionThreshold?: number;
    allowSeekAhead?: boolean;
  };
  site?: {
    supportPhone?: string;
    supportEmail?: string;
  };
}

export async function getPlatformSettings(): Promise<PlatformSettings> {
  await connectToDatabase();
  const settingDoc = await Setting.findOne({ key: "platform" }).lean();
  if (!settingDoc || !settingDoc.value) {
    return DEFAULT_PLATFORM_SETTINGS;
  }

  // Deep merge with defaults so missing keys don't cause undefined crashes
  const val = settingDoc.value as Partial<PlatformSettings>;
  return {
    security: {
      ...DEFAULT_PLATFORM_SETTINGS.security,
      ...(val.security || {}),
      strikeThresholds: {
        ...DEFAULT_PLATFORM_SETTINGS.security.strikeThresholds,
        ...(val.security?.strikeThresholds || {}),
      },
    },
    defaults: {
      ...DEFAULT_PLATFORM_SETTINGS.defaults,
      ...(val.defaults || {}),
    },
    site: {
      ...DEFAULT_PLATFORM_SETTINGS.site,
      ...(val.site || {}),
    },
  };
}

export async function updatePlatformSettings(
  updates: UpdatePlatformSettingsInput,
  adminId: string,
  ip?: string
): Promise<PlatformSettings> {
  await connectToDatabase();
  const current = await getPlatformSettings();

  const merged: PlatformSettings = {
    security: {
      ...current.security,
      ...(updates.security || {}),
      strikeThresholds: {
        ...current.security.strikeThresholds,
        ...(updates.security?.strikeThresholds || {}),
      },
    },
    defaults: {
      ...current.defaults,
      ...(updates.defaults || {}),
    },
    site: {
      ...current.site,
      ...(updates.site || {}),
    },
  };

  const updatedDoc = await Setting.findOneAndUpdate(
    { key: "platform" },
    {
      $set: {
        value: merged,
        updatedBy: adminId,
      },
    },
    { upsert: true, new: true }
  );

  await recordAuditLog({
    actorId: adminId,
    action: "platform.settings.update",
    entityType: "setting",
    entityId: "platform",
    summary: "Updated platform security thresholds and academy defaults",
    before: current as unknown as Record<string, unknown>,
    after: merged as unknown as Record<string, unknown>,
    ip,
  });

  return merged;
}
