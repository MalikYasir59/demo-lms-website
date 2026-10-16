"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  Sliders,
  FileText,
  Save,
  KeyRound,
  Laptop,
  Search,
  Sun,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeSelector } from "@/components/shared/ThemeSelector";
import { AvatarUpload } from "@/components/shared/AvatarUpload";

type SettingsTab = "profile" | "appearance" | "security" | "platform" | "audit";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile Form State
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin",
    avatar: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // Sessions State
  const [sessions, setSessions] = useState<any[]>([]);

  // Platform Settings State
  const [platform, setPlatform] = useState({
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
      supportEmail: "support@tradingtricks.com",
    },
  });
  const [savingPlatform, setSavingPlatform] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditSearch, setAuditSearch] = useState("");
  const [auditEntityType, setAuditEntityType] = useState("all");

  const loadSessions = () => {
    fetch("/api/admin/me/sessions")
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setSessions(res.data);
      })
      .catch((err) => console.error(err));
  };

  // Load initial data
  useEffect(() => {
    // 1. Load Admin Profile
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && res.data) {
          setProfile({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            role: res.data.role || "admin",
            avatar: res.data.avatar?.url || "",
          });
        }
      })
      .catch((err) => console.error(err));

    // 2. Load Sessions
    loadSessions();

    // 3. Load Platform Settings
    fetch("/api/admin/settings/platform")
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && res.data) {
          setPlatform(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const loadAuditLogs = () => {
    fetch(
      `/api/admin/audit-logs?q=${encodeURIComponent(auditSearch)}&entityType=${auditEntityType}`
    )
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setAuditLogs(res.data.items);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (activeTab === "audit") {
      loadAuditLogs();
    }
  }, [activeTab, auditSearch, auditEntityType]);

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await fetch("/api/admin/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to update profile");
      toast.success("Admin profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // Password Save
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 12) {
      toast.error("New password must be at least 12 characters");
      return;
    }

    try {
      setSavingPassword(true);
      const res = await fetch("/api/admin/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to update password");
      toast.success("Password changed! All other sessions revoked.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      loadSessions();
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  // Revoke Session
  const handleRevokeSession = async (sid: string) => {
    try {
      const res = await fetch(`/api/admin/me/sessions?sid=${sid}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to revoke session");
      toast.success("Session revoked");
      loadSessions();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Platform Save
  const handleSavePlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingPlatform(true);
      const res = await fetch("/api/admin/settings/platform", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(platform),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to save platform settings");
      toast.success("Platform settings saved and audit-logged");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingPlatform(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Platform Settings & Audit</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure security policies, anti-piracy thresholds, admin credentials, and inspect immutable system audit records.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        {(
          [
            { id: "profile", label: "My Profile", icon: User },
            { id: "appearance", label: "Appearance", icon: Sun },
            { id: "security", label: "Security & Sessions", icon: Shield },
            { id: "platform", label: "Platform Policy", icon: Sliders },
            { id: "audit", label: "Audit Log Trail", icon: FileText },
          ] as const
        ).map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === "profile" && (
        <div className="p-6 rounded-2xl bg-card border border-border max-w-2xl shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-1">Administrator Profile</h3>
            <p className="text-xs text-muted-foreground">Update your avatar, administrative name, and contact details</p>
          </div>

          {/* Institutional Avatar Upload with Square Cropper */}
          <AvatarUpload
            role="admin"
            currentAvatarUrl={profile.avatar}
            userName={profile.name}
            onAvatarUpdated={(newUrl) => {
              setProfile((prev) => ({ ...prev, avatar: newUrl || "" }));
            }}
          />

          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 border-t border-border">
            <div>
              <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{savingProfile ? "Saving..." : "Save Profile"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: APPEARANCE */}
      {activeTab === "appearance" && (
        <div className="p-6 rounded-2xl bg-card border border-border max-w-3xl shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-1">Visual Theme & Display Mode</h3>
            <p className="text-xs text-muted-foreground">
              Switch the administrative console between Light Mode, Dark Mode, or synchronize automatically with your operating system.
            </p>
          </div>
          <ThemeSelector />
        </div>
      )}

      {/* TAB 3: SECURITY & SESSIONS */}
      {activeTab === "security" && (
        <div className="space-y-6 max-w-3xl">
          {/* Password Change Form */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
            <h3 className="text-base font-semibold text-foreground mb-1">Change Admin Password</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Must be at least 12 characters. Changing your password immediately revokes all other device sessions.
            </p>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{savingPassword ? "Updating Password..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Sessions List */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
            <h3 className="text-base font-semibold text-foreground mb-1">Active Administrator Devices</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Authorized admin sessions currently signed in to the console
            </p>

            <div className="space-y-3">
              {sessions.map((s) => (
                <div
                  key={s.sid}
                  className="p-4 rounded-xl bg-muted/40 border border-border flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-primary shadow-xs">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">
                          {s.deviceLabel || "Web Browser"}
                        </span>
                        {s.isCurrent && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30 font-mono">
                            Current Device
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        IP: {s.ip} · Last active: {new Date(s.lastSeenAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {!s.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(s.sid)}
                      className="px-3 py-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 text-xs font-mono transition-colors cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PLATFORM POLICY */}
      {activeTab === "platform" && (
        <form onSubmit={handleSavePlatform} className="space-y-6 max-w-3xl">
          {/* Security & Multi-Device Policy */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-foreground">Security & Multi-Device Gating</h3>
            <p className="text-xs text-muted-foreground">
              Enforce single-device playback and automated anti-tamper thresholds
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase mb-1">
                  Max Devices Per Student
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={platform.security.maxStudentDevices}
                  onChange={(e) =>
                    setPlatform({
                      ...platform,
                      security: {
                        ...platform.security,
                        maxStudentDevices: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                />
                <span className="text-[10px] text-muted-foreground">Recommended: 1 device</span>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase mb-1">
                  Absolute Session Lifetime (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="72"
                  value={platform.security.sessionLifetimeHours}
                  onChange={(e) =>
                    setPlatform({
                      ...platform,
                      security: {
                        ...platform.security,
                        sessionLifetimeHours: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                />
                <span className="text-[10px] text-muted-foreground">Default: 12 hours</span>
              </div>
            </div>

            {/* Strike Thresholds */}
            <div className="pt-2 border-t border-border">
              <h4 className="text-xs font-semibold text-foreground uppercase font-mono mb-3">
                Anti-Piracy Strike Score Escalation Ladder (7-Day Rolling)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <span className="text-[10px] font-mono text-warning block uppercase font-medium">
                    Tier 1: Warn Notice
                  </span>
                  <input
                    type="number"
                    value={platform.security.strikeThresholds.warn}
                    onChange={(e) =>
                      setPlatform({
                        ...platform,
                        security: {
                          ...platform.security,
                          strikeThresholds: {
                            ...platform.security.strikeThresholds,
                            warn: parseInt(e.target.value, 10),
                          },
                        },
                      })
                    }
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-card border border-border text-foreground text-xs font-mono"
                  />
                  <span className="text-[9px] text-muted-foreground mt-1 block">Default: 3 points</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <span className="text-[10px] font-mono text-destructive block uppercase font-medium">
                    Tier 2: Force Logout
                  </span>
                  <input
                    type="number"
                    value={platform.security.strikeThresholds.logout}
                    onChange={(e) =>
                      setPlatform({
                        ...platform,
                        security: {
                          ...platform.security,
                          strikeThresholds: {
                            ...platform.security.strikeThresholds,
                            logout: parseInt(e.target.value, 10),
                          },
                        },
                      })
                    }
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-card border border-border text-foreground text-xs font-mono"
                  />
                  <span className="text-[9px] text-muted-foreground mt-1 block">Default: 8 points</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border">
                  <span className="text-[10px] font-mono text-primary block uppercase font-medium">
                    Tier 3: Account Lock
                  </span>
                  <input
                    type="number"
                    value={platform.security.strikeThresholds.lock}
                    onChange={(e) =>
                      setPlatform({
                        ...platform,
                        security: {
                          ...platform.security,
                          strikeThresholds: {
                            ...platform.security.strikeThresholds,
                            lock: parseInt(e.target.value, 10),
                          },
                        },
                      })
                    }
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-card border border-border text-foreground text-xs font-mono"
                  />
                  <span className="text-[9px] text-muted-foreground mt-1 block">Default: 15 points</span>
                </div>
              </div>
            </div>

            {/* Devtools guard toggle */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-foreground block">
                  Developer Tools Guard Probes
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Detect console, timing, and resize inspection probes in player shell
                </span>
              </div>
              <input
                type="checkbox"
                checked={platform.security.devtoolsGuardEnabled}
                onChange={(e) =>
                  setPlatform({
                    ...platform,
                    security: {
                      ...platform.security,
                      devtoolsGuardEnabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-primary bg-muted border-border focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Academic & Completion Defaults */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-foreground">Academy Defaults</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase mb-1">
                  Default Access Duration (Days)
                </label>
                <input
                  type="number"
                  value={platform.defaults.accessDurationDays}
                  onChange={(e) =>
                    setPlatform({
                      ...platform,
                      defaults: {
                        ...platform.defaults,
                        accessDurationDays: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase mb-1">
                  Lecture Completion Threshold (%)
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={platform.defaults.completionThreshold}
                  onChange={(e) =>
                    setPlatform({
                      ...platform,
                      defaults: {
                        ...platform.defaults,
                        completionThreshold: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPlatform}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{savingPlatform ? "Saving Changes..." : "Save Platform Policy"}</span>
          </button>
        </form>
      )}

      {/* TAB 4: AUDIT LOG TRAIL */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          {/* Audit Search Bar */}
          <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail by summary, action..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-muted/40 border border-border text-foreground text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-muted-foreground font-mono">Entity:</span>
              <select
                value={auditEntityType}
                onChange={(e) => setAuditEntityType(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-muted/40 border border-border text-foreground text-xs font-mono focus:outline-none"
              >
                <option value="all">All Entities</option>
                <option value="student">Student</option>
                <option value="course">Course</option>
                <option value="enrollment">Enrollment</option>
                <option value="setting">Setting</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          {/* Audit Table */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Actor</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Entity</th>
                    <th className="p-4">Summary</th>
                    <th className="p-4">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-4 font-mono text-muted-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-foreground">{log.actor.name}</div>
                        <div className="text-[10px] text-muted-foreground">{log.actor.role}</div>
                      </td>
                      <td className="p-4 font-mono text-primary">{log.action}</td>
                      <td className="p-4 font-mono text-muted-foreground">
                        <span className="px-2 py-0.5 rounded bg-muted border border-border/50 text-[10px]">
                          {log.entityType}
                        </span>
                      </td>
                      <td className="p-4 text-foreground max-w-md">{log.summary}</td>
                      <td className="p-4 font-mono text-muted-foreground text-[11px]">{log.ip}</td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No audit records found matching your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
