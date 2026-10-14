"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Key,
  Trash2,
  Shield,
  Smartphone,
  BookOpen,
  UserCheck,
  History,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Lock,
  Edit2,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { IUser, IAuthSession } from "@/types/lms";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const studentId = params.id as string;

  const [activeTab, setActiveTab] = useState<"overview" | "enrollments" | "sessions" | "audit">("overview");
  const [copiedCode, setCopiedCode] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [temporaryPasswordNotice, setTemporaryPasswordNotice] = useState<string | null>(null);

  // Editable Admin Notes state
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [adminNotesText, setAdminNotesText] = useState("");

  // Fetch Student Data
  const { data: student, isLoading } = useQuery<IUser>({
    queryKey: ["admin_student_detail", studentId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/students/${studentId}`);
      if (!res.ok) throw new Error("Failed to load student details");
      const json = await res.json();
      setAdminNotesText(json.data.adminNotes || "");
      return json.data;
    },
  });

  // Fetch Student Sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery<IAuthSession[]>({
    queryKey: ["admin_student_sessions", studentId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/students/${studentId}/sessions`);
      if (!res.ok) throw new Error("Failed to load sessions");
      const json = await res.json();
      return json.data;
    },
    enabled: activeTab === "sessions",
  });

  // Status Mutation
  const statusMutation = useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(`/api/admin/students/${studentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Status update failed");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Status Updated");
      queryClient.invalidateQueries({ queryKey: ["admin_student_detail", studentId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/students/${studentId}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Password reset failed");
      return json.data;
    },
    onSuccess: (data) => {
      toast.success("Password Reset Generated");
      setTemporaryPasswordNotice(data.temporaryPassword);
      setIsResetOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin_student_sessions", studentId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Update Notes Mutation
  const updateNotesMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: adminNotesText }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Update failed");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Admin Notes Saved");
      setIsEditingNotes(false);
      queryClient.invalidateQueries({ queryKey: ["admin_student_detail", studentId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Revoke Session Mutation
  const revokeSessionMutation = useMutation({
    mutationFn: async (sid?: string) => {
      const url = sid
        ? `/api/admin/students/${studentId}/sessions?sid=${encodeURIComponent(sid)}`
        : `/api/admin/students/${studentId}/sessions`;
      const res = await fetch(url, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to revoke session");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Session(s) Terminated");
      queryClient.invalidateQueries({ queryKey: ["admin_student_sessions", studentId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Soft Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Delete failed");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Student Archived");
      router.push("/admin/students");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const copyStudentCode = () => {
    if (!student?.studentCode) return;
    navigator.clipboard.writeText(student.studentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    toast.success("Student ID Copied");
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-[#94a3b8]">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#6366f1] mb-3" />
        <p className="text-xs">Loading student profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-12 text-center text-[#94a3b8]">
        <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
        <h2 className="text-lg font-bold text-white">Student Not Found</h2>
        <p className="text-xs text-[#64748b] mt-1 mb-4">The student may have been archived or does not exist.</p>
        <Link
          href="/admin/students"
          className="px-4 py-2 rounded-xl bg-[#121824] border border-[#1e293b] text-xs text-white"
        >
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation Breadcrumb */}
      <div>
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Students Directory</span>
        </Link>
      </div>

      {/* Main Student Header Card */}
      <div className="p-6 rounded-2xl bg-[#0b0f17] border border-[#1e293b] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#121824] border border-[#6366f1]/30 flex items-center justify-center text-[#6366f1] font-bold text-xl shrink-0">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-white tracking-tight">{student.name}</h1>
              <button
                onClick={copyStudentCode}
                className="px-2.5 py-0.5 rounded-md bg-[#121824] border border-[#1e293b] text-xs font-mono font-semibold text-[#10b981] flex items-center gap-1 hover:border-[#10b981]/50 transition-colors"
              >
                <span>{student.studentCode || "NO-CODE"}</span>
                {copiedCode ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3 text-[#64748b]" />}
              </button>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${
                  student.status === "active"
                    ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30"
                    : student.status === "suspended"
                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                    : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                }`}
              >
                {student.status}
              </span>
            </div>
            <div className="text-xs text-[#94a3b8] mt-1 flex items-center gap-3 flex-wrap">
              <span>{student.email}</span>
              {student.phone && (
                <>
                  <span className="text-[#334155]">&bull;</span>
                  <span>{student.phone}</span>
                </>
              )}
              <span className="text-[#334155]">&bull;</span>
              <span>Enrolled {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : ""}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setIsResetOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#121824] border border-[#1e293b] text-xs font-medium text-[#f59e0b] hover:bg-[#f59e0b]/10 transition-colors flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Reset Password</span>
          </button>

          <button
            onClick={() => {
              const target = student.status === "active" ? "suspended" : "active";
              statusMutation.mutate(target);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#121824] border border-[#1e293b] text-xs font-medium text-[#cbd5e1] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{student.status === "active" ? "Suspend Account" : "Activate Account"}</span>
          </button>

          <button
            onClick={() => {
              if (confirm(`Archive ${student.name}? This will revoke their access.`)) {
                deleteMutation.mutate();
              }
            }}
            className="p-2 rounded-xl bg-[#121824] border border-[#1e293b] text-[#94a3b8] hover:text-red-400 hover:border-red-500/40 transition-colors"
            title="Archive Student"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#1e293b] pb-1 text-xs font-medium">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === "overview"
              ? "bg-[#6366f1] text-white font-semibold"
              : "text-[#94a3b8] hover:text-white hover:bg-[#121824]"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Profile & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("enrollments")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === "enrollments"
              ? "bg-[#6366f1] text-white font-semibold"
              : "text-[#94a3b8] hover:text-white hover:bg-[#121824]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Enrolled Courses</span>
        </button>

        <button
          onClick={() => setActiveTab("sessions")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === "sessions"
              ? "bg-[#6366f1] text-white font-semibold"
              : "text-[#94a3b8] hover:text-white hover:bg-[#121824]"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Devices & Sessions</span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === "audit"
              ? "bg-[#6366f1] text-white font-semibold"
              : "text-[#94a3b8] hover:text-white hover:bg-[#121824]"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Security & Audit</span>
        </button>
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Personal Details */}
            <div className="p-5 rounded-2xl bg-[#0b0f17] border border-[#1e293b]">
              <h3 className="text-sm font-bold text-white mb-4">Personal & Contact Telemetry</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#64748b] block mb-0.5">Full Name</span>
                  <span className="text-white font-medium">{student.name}</span>
                </div>
                <div>
                  <span className="text-[#64748b] block mb-0.5">Email Address</span>
                  <span className="text-white font-mono">{student.email}</span>
                </div>
                <div>
                  <span className="text-[#64748b] block mb-0.5">Phone Number</span>
                  <span className="text-white font-mono">{student.phone || "Not provided"}</span>
                </div>
                <div>
                  <span className="text-[#64748b] block mb-0.5">Experience Level</span>
                  <span className="text-[#10b981] capitalize font-medium">
                    {student.profile?.experienceLevel || "Beginner"}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748b] block mb-0.5">CNIC / ID Number</span>
                  <span className="text-white font-mono">{student.profile?.idNumber || "Not recorded"}</span>
                </div>
                <div>
                  <span className="text-[#64748b] block mb-0.5">Education / Occupation</span>
                  <span className="text-white">
                    {[student.profile?.education, student.profile?.occupation].filter(Boolean).join(" • ") || "Not provided"}
                  </span>
                </div>
              </div>

              {student.profile?.address?.city && (
                <div className="mt-4 pt-4 border-t border-[#1e293b]/60 text-xs">
                  <span className="text-[#64748b] block mb-0.5">Location</span>
                  <span className="text-white">
                    {[
                      student.profile.address.line1,
                      student.profile.address.city,
                      student.profile.address.state,
                      student.profile.address.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Admin Notes */}
            <div className="p-5 rounded-2xl bg-[#0b0f17] border border-[#1e293b]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Administrative Notes</h3>
                {!isEditingNotes ? (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="text-xs text-[#6366f1] hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <button
                    onClick={() => updateNotesMutation.mutate()}
                    disabled={updateNotesMutation.isPending}
                    className="px-3 py-1 rounded-lg bg-[#6366f1] text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <textarea
                  rows={4}
                  value={adminNotesText}
                  onChange={(e) => setAdminNotesText(e.target.value)}
                  className="w-full bg-[#121824] border border-[#1e293b] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                  placeholder="Record private administrative notes regarding this student..."
                />
              ) : (
                <p className="text-xs text-[#94a3b8] leading-relaxed whitespace-pre-wrap">
                  {student.adminNotes || "No notes recorded yet."}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Security Status Overview */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0b0f17] border border-[#1e293b] space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#10b981]" />
                <span>Security Overview</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121824]">
                  <span className="text-[#64748b]">Login Count</span>
                  <span className="text-white font-mono font-semibold">{student.loginCount || 0}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121824]">
                  <span className="text-[#64748b]">Failed Attempts</span>
                  <span className="text-white font-mono font-semibold">
                    {student.security?.failedLogins || 0} / 5
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121824]">
                  <span className="text-[#64748b]">Anti-Piracy Strikes</span>
                  <span className="text-white font-mono font-semibold">
                    {student.security?.strikes || 0} / 3
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121824]">
                  <span className="text-[#64748b]">Security Lock</span>
                  <span className={`font-semibold ${student.security?.securityLocked ? "text-red-400" : "text-[#10b981]"}`}>
                    {student.security?.securityLocked ? "LOCKED" : "Normal"}
                  </span>
                </div>

                <div className="pt-2 text-[11px] text-[#64748b] font-mono">
                  <div>Last IP: {student.lastLoginIp || "Never"}</div>
                  <div>
                    Last Login:{" "}
                    {student.lastLoginAt ? new Date(student.lastLoginAt).toLocaleString() : "Never"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Enrollments */}
      {activeTab === "enrollments" && (
        <div className="p-8 rounded-2xl bg-[#0b0f17] border border-[#1e293b] text-center">
          <BookOpen className="w-8 h-8 text-[#334155] mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">Course Enrollment Matrix</h3>
          <p className="text-xs text-[#64748b] max-w-md mx-auto mt-1 mb-5">
            Student course grants, completion thresholds, and expiry limits are managed in Work Package P4 (Enrollment Engine).
          </p>
          <div className="inline-block p-4 rounded-xl bg-[#121824] border border-[#1e293b] text-xs text-[#94a3b8] font-mono">
            Status: Ready for Phase P4 integration
          </div>
        </div>
      )}

      {/* TAB CONTENT: Sessions & Devices */}
      {activeTab === "sessions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Active & Recent Device Sessions</h3>
            <button
              onClick={() => revokeSessionMutation.mutate(undefined)}
              disabled={revokeSessionMutation.isPending}
              className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
            >
              Terminate All Sessions
            </button>
          </div>

          <div className="rounded-2xl bg-[#0b0f17] border border-[#1e293b] overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1e293b] bg-[#121824]/60 text-[#64748b] font-mono">
                  <th className="p-3.5">Device Label</th>
                  <th className="p-3.5">IP Address</th>
                  <th className="p-3.5">Last Seen</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {sessionsLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#94a3b8]">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#6366f1]" />
                    </td>
                  </tr>
                ) : !sessions || sessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#64748b]">
                      No recorded sessions for this account.
                    </td>
                  </tr>
                ) : (
                  sessions.map((sess) => {
                    const isActive = !sess.revokedAt && new Date(sess.expiresAt) > new Date();
                    return (
                      <tr key={sess.sid} className="hover:bg-[#121824]/40">
                        <td className="p-3.5 font-medium text-white flex items-center gap-2">
                          <Smartphone className="w-3.5 h-3.5 text-[#6366f1]" />
                          <span>{sess.deviceLabel || "Standard Web Browser"}</span>
                        </td>
                        <td className="p-3.5 font-mono text-[#94a3b8]">{sess.ip}</td>
                        <td className="p-3.5 font-mono text-[#64748b]">
                          {new Date(sess.lastSeenAt).toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          {isActive ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 font-medium text-[11px] flex items-center gap-1 w-max">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/30 text-[11px] capitalize w-max">
                              Revoked ({sess.revokedReason || "Terminated"})
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          {isActive && (
                            <button
                              onClick={() => revokeSessionMutation.mutate(sess.sid)}
                              className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium"
                            >
                              Terminate
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Audit & Security */}
      {activeTab === "audit" && (
        <div className="p-6 rounded-2xl bg-[#0b0f17] border border-[#1e293b] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#f59e0b]" />
            <span>Forensic Watermark & Security Profile</span>
          </h3>

          <div className="p-4 rounded-xl bg-[#121824] border border-[#1e293b] text-xs font-mono text-[#cbd5e1] space-y-2">
            <div>
              <span className="text-[#64748b]">Watermark Forensic ID: </span>
              <span className="text-[#10b981] font-semibold">{student.studentCode}</span>
            </div>
            <div>
              <span className="text-[#64748b]">Watermark Text: </span>
              <span className="text-white">
                {student.name} • {student.email} • {student.phone || "ITT"}
              </span>
            </div>
            <div>
              <span className="text-[#64748b]">Accepted Terms: </span>
              <span className="text-white">
                {student.acceptedTermsAt ? new Date(student.acceptedTermsAt).toISOString() : "Pending First Login"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0b0f17] border border-[#1e293b] rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4 text-[#f59e0b]">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-lg font-bold text-white">Reset Student Password</h2>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed mb-6">
              This will generate a fresh secure password and invalidate all current sessions for {student.name}.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsResetOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#94a3b8] hover:bg-[#121824]"
              >
                Cancel
              </button>
              <button
                onClick={() => resetPasswordMutation.mutate()}
                disabled={resetPasswordMutation.isPending}
                className="px-4 py-2 rounded-xl bg-[#f59e0b] text-black text-xs font-semibold flex items-center gap-2"
              >
                {resetPasswordMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Generate Password</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEMPORARY PASSWORD DISPLAY */}
      {temporaryPasswordNotice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0b0f17] border border-[#10b981]/50 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4 text-[#10b981]">
              <Check className="w-6 h-6" />
              <h2 className="text-lg font-bold text-white">New Credentials Generated</h2>
            </div>
            <div className="p-4 rounded-xl bg-[#121824] border border-[#1e293b] font-mono text-xs space-y-2 mb-6">
              <div>
                <span className="text-[#64748b]">Student ID: </span>
                <span className="text-[#10b981] font-semibold">{student.studentCode}</span>
              </div>
              <div>
                <span className="text-[#64748b]">New Password: </span>
                <span className="text-[#f59e0b] font-bold text-sm bg-black/40 px-2 py-0.5 rounded">
                  {temporaryPasswordNotice}
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setTemporaryPasswordNotice(null)}
                className="px-4 py-2 rounded-xl bg-[#10b981] text-black text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
