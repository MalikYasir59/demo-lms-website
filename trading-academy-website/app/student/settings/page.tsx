"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Shield,
  Save,
  Lock,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  MapPin,
  Phone,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { IUser } from "@/types/lms";

export default function StudentSettingsPage() {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  // Form State
  const [form, setForm] = useState({
    profile: {
      experienceLevel: "beginner" as "beginner" | "intermediate" | "advanced",
      education: "",
      occupation: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        country: "Pakistan",
        postalCode: "",
      },
      emergencyContact: {
        name: "",
        phone: "",
        relation: "",
      },
    },
  });

  const { data: student, isLoading } = useQuery<IUser>({
    queryKey: ["student_me_profile"],
    queryFn: async () => {
      const res = await fetch("/api/student/me");
      if (!res.ok) throw new Error("Failed to load profile");
      const json = await res.json();
      return json.data;
    },
  });

  useEffect(() => {
    if (student) {
      setForm({
        profile: {
          experienceLevel: (student.profile?.experienceLevel as any) || "beginner",
          education: student.profile?.education || "",
          occupation: student.profile?.occupation || "",
          address: {
            line1: student.profile?.address?.line1 || "",
            line2: student.profile?.address?.line2 || "",
            city: student.profile?.address?.city || "",
            state: student.profile?.address?.state || "",
            country: student.profile?.address?.country || "Pakistan",
            postalCode: student.profile?.address?.postalCode || "",
          },
          emergencyContact: {
            name: student.profile?.emergencyContact?.name || "",
            phone: student.profile?.emergencyContact?.phone || "",
            relation: student.profile?.emergencyContact?.relation || "",
          },
        },
      });
    }
  }, [student]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/student/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to update profile");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Profile Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["student_me_profile"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const copyStudentId = () => {
    if (!student?.studentCode) return;
    navigator.clipboard.writeText(student.studentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Student ID copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-[#94a3b8]">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#6366f1] mb-2" />
        <p className="text-xs">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-[#6366f1]" />
          <span>Student Profile & Settings</span>
        </h1>
        <p className="text-xs text-[#94a3b8] mt-1">
          Manage your student profile, contact info, and experience settings
        </p>
      </div>

      {/* Security & Watermark Alert */}
      <div className="p-5 rounded-2xl bg-[#0b0f17] border border-[#6366f1]/30 flex items-start gap-3.5 shadow-xl">
        <Shield className="w-5 h-5 text-[#6366f1] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h2 className="font-semibold text-white">
            Forensic Watermarking & Account Integrity
          </h2>
          <p className="text-[#94a3b8] leading-relaxed">
            Your legal Name, Student ID, Email, and Phone number are bound to your student account and rendered dynamically onto all encrypted video streams for copyright protection. To request institutional updates to these credentials, please submit a formal request to Institute Administration.
          </p>
        </div>
      </div>

      {/* Institutional Credentials Card (Read-Only) */}
      <div className="p-6 rounded-3xl bg-[#0b0f17] border border-[#1e293b] space-y-5">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#10b981]" />
            <span>Official Student Credentials (Verified)</span>
          </h2>
          <span className="text-[11px] font-mono text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full border border-[#10b981]/20">
            Active Student
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#121824] border border-[#1e293b]">
            <span className="text-[#64748b] block mb-1">Student ID</span>
            <div className="flex items-center justify-between font-mono font-bold text-white">
              <span>{student?.studentCode || "Unassigned"}</span>
              <button
                type="button"
                onClick={copyStudentId}
                className="text-[#94a3b8] hover:text-white transition-colors"
                title="Copy Student Code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121824] border border-[#1e293b]">
            <span className="text-[#64748b] block mb-1">Full Legal Name</span>
            <span className="font-semibold text-white block truncate">
              {student?.name || "Student"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121824] border border-[#1e293b]">
            <span className="text-[#64748b] block mb-1">Registered Email</span>
            <span className="font-mono text-white block truncate">
              {student?.email}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121824] border border-[#1e293b]">
            <span className="text-[#64748b] block mb-1">Registered Phone</span>
            <span className="font-mono text-white block truncate">
              {student?.phone || "None"}
            </span>
          </div>
        </div>
      </div>

      {/* Editable Student Profile Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateProfileMutation.mutate();
        }}
        className="p-6 rounded-3xl bg-[#0b0f17] border border-[#1e293b] space-y-6"
      >
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-[#6366f1]" />
            <span>Personal & Telemetry Details</span>
          </h2>
          <span className="text-xs text-[#64748b]">Editable by student</span>
        </div>

        {/* Experience Level & Education */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-[#cbd5e1] font-medium mb-1">Trading Experience</label>
            <select
              value={form.profile.experienceLevel}
              onChange={(e) =>
                setForm({
                  ...form,
                  profile: {
                    ...form.profile,
                    experienceLevel: e.target.value as any,
                  },
                })
              }
              className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
            >
              <option value="beginner">Beginner (0-1 year)</option>
              <option value="intermediate">Intermediate (1-3 years)</option>
              <option value="advanced">Advanced (3+ years)</option>
            </select>
          </div>

          <div>
            <label className="block text-[#cbd5e1] font-medium mb-1">Education Level</label>
            <input
              type="text"
              placeholder="e.g. Bachelor's in Finance"
              value={form.profile.education}
              onChange={(e) =>
                setForm({
                  ...form,
                  profile: { ...form.profile, education: e.target.value },
                })
              }
              className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
            />
          </div>

          <div>
            <label className="block text-[#cbd5e1] font-medium mb-1">Occupation</label>
            <input
              type="text"
              placeholder="e.g. Independent Trader / Engineer"
              value={form.profile.occupation}
              onChange={(e) =>
                setForm({
                  ...form,
                  profile: { ...form.profile, occupation: e.target.value },
                })
              }
              className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
            />
          </div>
        </div>

        {/* Residential Address */}
        <div className="space-y-3 pt-2 text-xs">
          <h3 className="font-semibold text-white flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#6366f1]" />
            <span>Mailing & Physical Address</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#64748b] mb-1">Street Address Line 1</label>
              <input
                type="text"
                placeholder="House / Apt, Street"
                value={form.profile.address.line1}
                onChange={(e) =>
                  setForm({
                    ...form,
                    profile: {
                      ...form.profile,
                      address: { ...form.profile.address, line1: e.target.value },
                    },
                  })
                }
                className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div>
              <label className="block text-[#64748b] mb-1">Street Address Line 2</label>
              <input
                type="text"
                placeholder="Sector, Landmark (Optional)"
                value={form.profile.address.line2}
                onChange={(e) =>
                  setForm({
                    ...form,
                    profile: {
                      ...form.profile,
                      address: { ...form.profile.address, line2: e.target.value },
                    },
                  })
                }
                className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[#64748b] mb-1">City</label>
              <input
                type="text"
                placeholder="e.g. Lahore"
                value={form.profile.address.city}
                onChange={(e) =>
                  setForm({
                    ...form,
                    profile: {
                      ...form.profile,
                      address: { ...form.profile.address, city: e.target.value },
                    },
                  })
                }
                className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div>
              <label className="block text-[#64748b] mb-1">State / Province</label>
              <input
                type="text"
                placeholder="e.g. Punjab"
                value={form.profile.address.state}
                onChange={(e) =>
                  setForm({
                    ...form,
                    profile: {
                      ...form.profile,
                      address: { ...form.profile.address, state: e.target.value },
                    },
                  })
                }
                className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div>
              <label className="block text-[#64748b] mb-1">Country</label>
              <input
                type="text"
                placeholder="Pakistan"
                value={form.profile.address.country}
                onChange={(e) =>
                  setForm({
                    ...form,
                    profile: {
                      ...form.profile,
                      address: { ...form.profile.address, country: e.target.value },
                    },
                  })
                }
                className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div>
              <label className="block text-[#64748b] mb-1">Postal Code</label>
              <input
                type="text"
                placeholder="54000"
                value={form.profile.address.postalCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    profile: {
                      ...form.profile,
                      address: { ...form.profile.address, postalCode: e.target.value },
                    },
                  })
                }
                className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-3 pt-2 text-xs">
          <h3 className="font-semibold text-white flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Emergency Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#64748b] mb-1">Contact Name</label>
              <input
                type="text"
                placeholder="Guardian / Spouse Name"
                value={form.profile.emergencyContact.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    profile: {
                      ...form.profile,
                      emergencyContact: {
                        ...form.profile.emergencyContact,
                        name: e.target.value,
                      },
                    },
                  })
                }
                className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div>
              <label className="block text-[#64748b] mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="+92 300 1234567"
                value={form.profile.emergencyContact.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    profile: {
                      ...form.profile,
                      emergencyContact: {
                        ...form.profile.emergencyContact,
                        phone: e.target.value,
                      },
                    },
                  })
                }
                className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div>
              <label className="block text-[#64748b] mb-1">Relationship</label>
              <input
                type="text"
                placeholder="e.g. Brother, Parent"
                value={form.profile.emergencyContact.relation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    profile: {
                      ...form.profile,
                      emergencyContact: {
                        ...form.profile.emergencyContact,
                        relation: e.target.value,
                      },
                    },
                  })
                }
                className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#1e293b] flex justify-end">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white text-xs font-semibold hover:opacity-95 transition-all shadow-md shadow-[#6366f1]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
