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
  const { data, isLoading } = useQuery({
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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Student Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-muted border border-border text-xs font-mono text-success font-medium">
              {totalStudents} Enrolled
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage quantitative price action student accounts, credentials, and access rules
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <a
            href="/api/admin/students/export"
            download
            className="px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={() => setIsImportOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3 rounded-2xl bg-card border border-border flex flex-col md:flex-row items-center gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student code, name, email or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-background border border-input rounded-xl px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary"
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
            className="bg-background border border-input rounded-xl px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary"
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
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-between text-xs text-foreground animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{selectedIds.length} students selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => bulkMutation.mutate("activate")}
              className="px-2.5 py-1 rounded-lg bg-success/15 text-success hover:bg-success/25 font-medium cursor-pointer"
            >
              Activate
            </button>
            <button
              onClick={() => bulkMutation.mutate("suspend")}
              className="px-2.5 py-1 rounded-lg bg-warning/15 text-warning hover:bg-warning/25 font-medium cursor-pointer"
            >
              Suspend
            </button>
            <button
              onClick={() => {
                if (confirm(`Archive ${selectedIds.length} students?`)) {
                  bulkMutation.mutate("delete");
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 font-medium cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase tracking-wider font-mono">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      studentsList.length > 0 && selectedIds.length === studentsList.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border accent-primary cursor-pointer"
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
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-xs">Loading directory...</p>
                  </td>
                </tr>
              ) : studentsList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto text-muted-foreground/60 mb-2" />
                    <p className="text-sm font-semibold text-foreground">No students found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
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
                      className={`hover:bg-muted/40 transition-colors ${
                        isChecked ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handleSelectRow(student._id.toString(), e.target.checked)
                          }
                          className="rounded border-border accent-primary cursor-pointer"
                        />
                      </td>

                      {/* Student Code Badge */}
                      <td className="p-3.5 font-mono text-foreground font-semibold">
                        <span className="px-2 py-1 rounded-md bg-muted border border-border">
                          {student.studentCode || "—"}
                        </span>
                      </td>

                      {/* Name & Email */}
                      <td className="p-3.5">
                        <div className="font-semibold text-foreground">{student.name}</div>
                        <div className="text-[11px] font-mono text-muted-foreground">{student.email}</div>
                      </td>

                      {/* Phone */}
                      <td className="p-3.5 font-mono text-muted-foreground">
                        {student.phone || "—"}
                      </td>

                      {/* Experience Level */}
                      <td className="p-3.5">
                        <span className="capitalize px-2 py-0.5 rounded-md bg-muted border border-border text-[11px] text-muted-foreground font-medium">
                          {student.profile?.experienceLevel || "beginner"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                            student.status === "active"
                              ? "bg-success/10 text-success border-success/30"
                              : student.status === "suspended"
                              ? "bg-destructive/10 text-destructive border-destructive/30"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              student.status === "active"
                                ? "bg-success animate-pulse"
                                : student.status === "suspended"
                                ? "bg-destructive"
                                : "bg-muted-foreground"
                            }`}
                          />
                          <span className="capitalize">{student.status}</span>
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="p-3.5 text-muted-foreground font-mono text-[11px]">
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
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-warning hover:bg-muted transition-colors cursor-pointer"
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
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-success hover:bg-muted transition-colors cursor-pointer"
                        >
                          <Shield className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          href={`/admin/students/${student._id.toString()}`}
                          title="View Details"
                          className="inline-block p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
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
        <div className="p-3.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Page {page} of {totalPages} &bull; Total {totalStudents} students
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-card border border-border text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg bg-card border border-border text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ADD STUDENT MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-foreground mb-1">Add New Student</h2>
            <p className="text-xs text-muted-foreground mb-5">
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
                <label className="block text-foreground font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-background border border-input rounded-xl px-3 py-2 text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background border border-input rounded-xl px-3 py-2 text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+923001234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-background border border-input rounded-xl px-3 py-2 text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground font-medium mb-1">Experience Level</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, experienceLevel: e.target.value })
                    }
                    className="w-full bg-background border border-input rounded-xl px-3 py-2 text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-1">
                    Custom Password <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={formData.customPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, customPassword: e.target.value })
                    }
                    className="w-full bg-background border border-input rounded-xl px-3 py-2 text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground font-medium mb-1">
                  Admin Internal Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Private administrative observations or enrollment remarks..."
                  value={formData.adminNotes}
                  onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                  className="w-full bg-background border border-input rounded-xl px-3 py-2 text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
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

      {/* RESET PASSWORD CONFIRMATION MODAL */}
      {isResetOpen && activeStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl relative animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4 text-warning">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-lg font-bold text-foreground">Reset Student Password</h2>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Resetting password for <span className="text-foreground font-semibold">{activeStudent.name}</span> ({activeStudent.studentCode}).
              This will generate a fresh secure temporary password and{" "}
              <span className="text-destructive font-semibold">
                immediately terminate all active device streaming sessions
              </span>.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsResetOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resetPasswordMutation.isPending}
                onClick={() => resetPasswordMutation.mutate(activeStudent._id.toString())}
                className="px-4 py-2 rounded-xl bg-warning text-warning-foreground text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {resetPasswordMutation.isPending && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
                )}
                <span>Generate New Password</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREDENTIAL NOTICE MODAL */}
      {credentialNotice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-success/40 rounded-2xl p-6 shadow-xl relative animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4 text-success">
              <Check className="w-6 h-6" />
              <h2 className="text-lg font-bold text-foreground">Generated Credentials</h2>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Please copy and securely deliver these credentials to the student. The password is not stored in plain text and cannot be viewed again.
            </p>

            <div className="p-4 rounded-xl bg-muted border border-border font-mono text-xs space-y-2 text-foreground">
              <div>
                <span className="text-muted-foreground">Student ID: </span>
                <span className="text-success font-semibold">{credentialNotice.studentCode}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email: </span>
                <span className="text-foreground">{credentialNotice.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Temporary Password: </span>
                <span className="text-warning font-bold text-sm bg-background px-2 py-0.5 rounded border border-border">
                  {credentialNotice.password}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-border">
              <button
                type="button"
                onClick={copyCredentials}
                className="px-4 py-2.5 rounded-xl bg-success text-success-foreground text-xs font-semibold flex items-center gap-1.5 hover:opacity-95 transition-opacity cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied Package!" : "Copy Credential Package"}</span>
              </button>

              <button
                type="button"
                onClick={() => setCredentialNotice(null)}
                className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV IMPORT MODAL */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsImportOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-foreground mb-1">Import Students from CSV</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Paste CSV rows or copy from Excel. Format:{" "}
              <code className="text-success font-mono">Name, Email, Phone, Level</code>
            </p>

            <textarea
              rows={6}
              placeholder="Tariq Mehmood, tariq@example.com, +923001234567, beginner&#10;Zainab Khan, zainab@example.com, +923019876543, intermediate"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full bg-background border border-input rounded-xl p-3 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary font-mono"
            />

            <div className="flex items-center justify-end gap-2.5 mt-4 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={importMutation.isPending || !importText.trim()}
                onClick={() => importMutation.mutate(importText)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {importMutation.isPending && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-foreground" />
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
