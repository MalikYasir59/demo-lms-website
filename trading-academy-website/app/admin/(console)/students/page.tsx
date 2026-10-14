"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  UserPlus,
  Download,
  Upload,
  Search,
  Key,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Shield,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { IUser } from "@/types/lms";

export default function StudentsDirectoryPage() {
  const queryClient = useQueryClient();

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState<IUser | null>(null);
  const [credentialNotice, setCredentialNotice] = useState<{
    studentCode: string;
    email: string;
    password: string;
  } | null>(null);

  // Add form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experienceLevel: "beginner",
    customPassword: "",
    adminNotes: "",
  });

  // Import text state
  const [importText, setImportText] = useState("");
  const [copied, setCopied] = useState(false);

  // Fetch Students
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin_students", page, search, statusFilter, levelFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        status: statusFilter,
        experienceLevel: levelFilter,
      });
      if (search.trim()) params.set("q", search.trim());

      const res = await fetch(`/api/admin/students?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const json = await res.json();
      return json.data;
    },
  });

  // Create Student Mutation
  const createMutation = useMutation({
    mutationFn: async (payload: typeof formData) => {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          phone: payload.phone || undefined,
          customPassword: payload.customPassword || undefined,
          profile: {
            experienceLevel: payload.experienceLevel,
          },
          adminNotes: payload.adminNotes || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to create student");
      return json.data;
    },
    onSuccess: (resData) => {
      toast.success("Student Created", { description: `${resData.student.name} enrolled.` });
      setCredentialNotice({
        studentCode: resData.student.studentCode,
        email: resData.student.email,
        password: resData.temporaryPassword,
      });
      setIsAddOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        experienceLevel: "beginner",
        customPassword: "",
        adminNotes: "",
      });
      queryClient.invalidateQueries({ queryKey: ["admin_students"] });
    },
    onError: (err: Error) => {
      toast.error("Creation Failed", { description: err.message });
    },
  });

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const res = await fetch(`/api/admin/students/${studentId}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to reset password");
      return json.data;
    },
    onSuccess: (resData) => {
      toast.success("Password Reset", { description: "Temporary password generated." });
      setCredentialNotice({
        studentCode: activeStudent?.studentCode || "",
        email: activeStudent?.email || "",
        password: resData.temporaryPassword,
      });
      setIsResetOpen(false);
    },
    onError: (err: Error) => {
      toast.error("Reset Failed", { description: err.message });
    },
  });

  // Status Change Mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/admin/students/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to update status");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Status Updated");
      queryClient.invalidateQueries({ queryKey: ["admin_students"] });
    },
    onError: (err: Error) => {
      toast.error("Failed to update status", { description: err.message });
    },
  });

  // Delete Student Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to delete student");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Student Archived");
      queryClient.invalidateQueries({ queryKey: ["admin_students"] });
    },
    onError: (err: Error) => {
      toast.error("Failed to delete", { description: err.message });
    },
  });

  // Bulk Action Mutation
  const bulkMutation = useMutation({
    mutationFn: async (action: "activate" | "suspend" | "delete") => {
      const res = await fetch("/api/admin/students/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentIds: selectedIds, action }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Bulk action failed");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Bulk Action Applied");
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ["admin_students"] });
    },
    onError: (err: Error) => {
      toast.error("Bulk action failed", { description: err.message });
    },
  });

  // CSV Import Mutation
  const importMutation = useMutation({
    mutationFn: async (csvString: string) => {
      const lines = csvString.trim().split("\n");
      const students: Array<{
        name: string;
        email: string;
        phone?: string;
        experienceLevel?: "beginner" | "intermediate" | "advanced";
      }> = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || (i === 0 && line.toLowerCase().includes("email"))) continue;
        const [name, email, phone, experienceLevel] = line.split(",").map((s) => s.trim());
        if (name && email) {
          students.push({
            name,
            email,
            phone: phone || undefined,
            experienceLevel: (experienceLevel as any) || "beginner",
          });
        }
      }

      if (students.length === 0) {
        throw new Error("No valid student rows found. Expected format: Name, Email, Phone, Level");
      }

      const res = await fetch("/api/admin/students/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Import failed");
      return json.data;
    },
    onSuccess: (resData) => {
      toast.success("Import Complete", {
        description: `Imported ${resData.importedCount} students. ${resData.failedCount} skipped.`,
      });
      setIsImportOpen(false);
      setImportText("");
      queryClient.invalidateQueries({ queryKey: ["admin_students"] });
    },
    onError: (err: Error) => {
      toast.error("Import Failed", { description: err.message });
    },
  });

  const studentsList: IUser[] = data?.items || [];
  const totalStudents = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(studentsList.map((s) => s._id.toString()));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const copyCredentials = () => {
    if (!credentialNotice) return;
    const txt = `Institute of Trading Tricks - Student Credentials\nStudent ID: ${credentialNotice.studentCode}\nLogin URL: ${window.location.origin}/login\nEmail: ${credentialNotice.email}\nPassword: ${credentialNotice.password}\n\nNote: Access is bound by a single-device streaming policy.`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Credentials Copied to Clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">Student Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#121824] border border-[#1e293b] text-xs font-mono text-[#10b981]">
              {totalStudents} Enrolled
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Manage quantitative price action student accounts, credentials, and access rules
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <a
            href="/api/admin/students/export"
            download
            className="px-3.5 py-2 rounded-xl bg-[#121824] border border-[#1e293b] text-xs font-medium text-[#cbd5e1] hover:text-white hover:border-[#334155] transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={() => setIsImportOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#121824] border border-[#1e293b] text-xs font-medium text-[#cbd5e1] hover:text-white hover:border-[#334155] transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white text-xs font-semibold hover:opacity-95 transition-all shadow-md shadow-[#6366f1]/25 flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3 rounded-2xl bg-[#0b0f17] border border-[#1e293b] flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student code, name, email or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#121824] border border-[#1e293b] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-[#475569] focus:outline-none focus:border-[#6366f1]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-[#cbd5e1] focus:outline-none focus:border-[#6366f1]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-[#cbd5e1] focus:outline-none focus:border-[#6366f1]"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 rounded-xl bg-[#6366f1]/15 border border-[#6366f1]/30 flex items-center justify-between text-xs text-white animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{selectedIds.length} students selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => bulkMutation.mutate("activate")}
              className="px-2.5 py-1 rounded-lg bg-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/30 font-medium"
            >
              Activate
            </button>
            <button
              onClick={() => bulkMutation.mutate("suspend")}
              className="px-2.5 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 font-medium"
            >
              Suspend
            </button>
            <button
              onClick={() => {
                if (confirm(`Archive ${selectedIds.length} students?`)) {
                  bulkMutation.mutate("delete");
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="rounded-2xl bg-[#0b0f17] border border-[#1e293b] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1e293b] bg-[#121824]/60 text-[#64748b] uppercase tracking-wider font-mono">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      studentsList.length > 0 && selectedIds.length === studentsList.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-[#1e293b] accent-[#6366f1]"
                  />
                </th>
                <th className="p-3.5">Student Code</th>
                <th className="p-3.5">Student Name & Email</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5">Experience</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Created</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#94a3b8]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#6366f1]" />
                    <p className="mt-2 text-xs">Loading directory...</p>
                  </td>
                </tr>
              ) : studentsList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#64748b]">
                    <Users className="w-8 h-8 mx-auto text-[#334155] mb-2" />
                    <p className="text-sm font-semibold text-[#94a3b8]">No students found</p>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      Try adjusting filters or add a new student.
                    </p>
                  </td>
                </tr>
              ) : (
                studentsList.map((student) => {
                  const isChecked = selectedIds.includes(student._id.toString());
                  return (
                    <tr
                      key={student._id.toString()}
                      className={`hover:bg-[#121824]/50 transition-colors ${
                        isChecked ? "bg-[#6366f1]/5" : ""
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handleSelectRow(student._id.toString(), e.target.checked)
                          }
                          className="rounded border-[#1e293b] accent-[#6366f1]"
                        />
                      </td>

                      {/* Student Code Badge */}
                      <td className="p-3.5 font-mono text-[#cbd5e1] font-semibold">
                        <span className="px-2 py-1 rounded-md bg-[#121824] border border-[#1e293b]">
                          {student.studentCode || "—"}
                        </span>
                      </td>

                      {/* Name & Email */}
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{student.name}</div>
                        <div className="text-[11px] font-mono text-[#64748b]">{student.email}</div>
                      </td>

                      {/* Phone */}
                      <td className="p-3.5 font-mono text-[#94a3b8]">
                        {student.phone || "—"}
                      </td>

                      {/* Experience Level */}
                      <td className="p-3.5">
                        <span className="capitalize px-2 py-0.5 rounded-md bg-[#121824] border border-[#1e293b] text-[11px] text-[#94a3b8]">
                          {student.profile?.experienceLevel || "beginner"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                            student.status === "active"
                              ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30"
                              : student.status === "suspended"
                              ? "bg-red-500/10 text-red-400 border-red-500/30"
                              : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              student.status === "active"
                                ? "bg-[#10b981] animate-pulse"
                                : student.status === "suspended"
                                ? "bg-red-400"
                                : "bg-gray-400"
                            }`}
                          />
                          <span className="capitalize">{student.status}</span>
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="p-3.5 text-[#64748b] font-mono text-[11px]">
                        {student.createdAt
                          ? new Date(student.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Action buttons */}
                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setActiveStudent(student);
                            setIsResetOpen(true);
                          }}
                          title="Reset Password"
                          className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#f59e0b] hover:bg-[#121824] transition-colors"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            const newStatus =
                              student.status === "active" ? "suspended" : "active";
                            statusMutation.mutate({
                              id: student._id.toString(),
                              status: newStatus,
                            });
                          }}
                          title={`Set ${student.status === "active" ? "Suspended" : "Active"}`}
                          className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#10b981] hover:bg-[#121824] transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          href={`/admin/students/${student._id.toString()}`}
                          title="View Details"
                          className="inline-block p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#121824] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => {
                            if (confirm(`Archive ${student.name}?`)) {
                              deleteMutation.mutate(student._id.toString());
                            }
                          }}
                          title="Delete"
                          className="p-1.5 rounded-lg text-[#94a3b8] hover:text-red-400 hover:bg-[#121824] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 border-t border-[#1e293b] flex items-center justify-between text-xs text-[#94a3b8]">
          <div>
            Page {page} of {totalPages} &bull; Total {totalStudents} students
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-[#121824] border border-[#1e293b] text-[#cbd5e1] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1e293b]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg bg-[#121824] border border-[#1e293b] text-[#cbd5e1] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1e293b]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD STUDENT MODAL */}
      {/* ========================================================================= */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0b0f17] border border-[#1e293b] rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-5 right-5 text-[#64748b] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Add New Student</h2>
            <p className="text-xs text-[#94a3b8] mb-5">
              Generates official student ID and credential package
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(formData);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-[#cbd5e1] font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cbd5e1] font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
                  />
                </div>

                <div>
                  <label className="block text-[#cbd5e1] font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+923001234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cbd5e1] font-medium mb-1">Experience Level</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, experienceLevel: e.target.value })
                    }
                    className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#cbd5e1] font-medium mb-1">
                    Custom Password <span className="text-[#64748b]">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={formData.customPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, customPassword: e.target.value })
                    }
                    className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cbd5e1] font-medium mb-1">
                  Admin Internal Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Private administrative observations or enrollment remarks..."
                  value={formData.adminNotes}
                  onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                  className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#94a3b8] hover:bg-[#121824]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {createMutation.isPending && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESET PASSWORD CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {isResetOpen && activeStudent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0b0f17] border border-[#1e293b] rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4 text-[#f59e0b]">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-lg font-bold text-white">Reset Student Password</h2>
            </div>

            <p className="text-xs text-[#94a3b8] leading-relaxed mb-6">
              Resetting password for <span className="text-white font-semibold">{activeStudent.name}</span> ({activeStudent.studentCode}).
              This will generate a fresh secure temporary password and{" "}
              <span className="text-red-400 font-semibold">
                immediately terminate all active device streaming sessions
              </span>.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#1e293b]">
              <button
                type="button"
                onClick={() => setIsResetOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#94a3b8] hover:bg-[#121824]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resetPasswordMutation.isPending}
                onClick={() => resetPasswordMutation.mutate(activeStudent._id.toString())}
                className="px-4 py-2 rounded-xl bg-[#f59e0b] text-black text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {resetPasswordMutation.isPending && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                )}
                <span>Generate New Password</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREDENTIAL NOTICE MODAL (Shows One-Time Password with One-Click Copy) */}
      {/* ========================================================================= */}
      {credentialNotice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0b0f17] border border-[#10b981]/50 rounded-2xl p-6 shadow-2xl shadow-[#10b981]/10 relative animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4 text-[#10b981]">
              <Check className="w-6 h-6" />
              <h2 className="text-lg font-bold text-white">Generated Credentials</h2>
            </div>

            <p className="text-xs text-[#94a3b8] mb-4">
              Please copy and securely deliver these credentials to the student. The password is not stored in plain text and cannot be viewed again.
            </p>

            <div className="p-4 rounded-xl bg-[#121824] border border-[#1e293b] font-mono text-xs space-y-2 text-[#cbd5e1]">
              <div>
                <span className="text-[#64748b]">Student ID: </span>
                <span className="text-[#10b981] font-semibold">{credentialNotice.studentCode}</span>
              </div>
              <div>
                <span className="text-[#64748b]">Email: </span>
                <span className="text-white">{credentialNotice.email}</span>
              </div>
              <div>
                <span className="text-[#64748b]">Temporary Password: </span>
                <span className="text-[#f59e0b] font-bold text-sm bg-black/40 px-2 py-0.5 rounded">
                  {credentialNotice.password}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-[#1e293b]">
              <button
                type="button"
                onClick={copyCredentials}
                className="px-4 py-2.5 rounded-xl bg-[#10b981] text-black text-xs font-semibold flex items-center gap-1.5 hover:opacity-95 transition-opacity"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied Package!" : "Copy Credential Package"}</span>
              </button>

              <button
                type="button"
                onClick={() => setCredentialNotice(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#94a3b8] hover:bg-[#121824]"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CSV IMPORT MODAL */}
      {/* ========================================================================= */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0b0f17] border border-[#1e293b] rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsImportOpen(false)}
              className="absolute top-5 right-5 text-[#64748b] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Import Students from CSV</h2>
            <p className="text-xs text-[#94a3b8] mb-4">
              Paste CSV rows or copy from Excel. Format:{" "}
              <code className="text-[#10b981] font-mono">Name, Email, Phone, Level</code>
            </p>

            <textarea
              rows={6}
              placeholder="Tariq Mehmood, tariq@example.com, +923001234567, beginner&#10;Zainab Khan, zainab@example.com, +923019876543, intermediate"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full bg-[#121824] border border-[#1e293b] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#6366f1] font-mono"
            />

            <div className="flex items-center justify-end gap-2.5 mt-4 pt-3 border-t border-[#1e293b]">
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#94a3b8] hover:bg-[#121824]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={importMutation.isPending || !importText.trim()}
                onClick={() => importMutation.mutate(importText)}
                className="px-4 py-2 rounded-xl bg-[#6366f1] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {importMutation.isPending && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                )}
                <span>Run Batch Import</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
