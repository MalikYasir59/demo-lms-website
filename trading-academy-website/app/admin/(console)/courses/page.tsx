"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Clock,
  Video,
  Users,
  Loader2,
  CheckCircle,
  X,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { ICourse, ICategory } from "@/types/lms";

export default function CoursesDirectoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newDifficulty, setNewDifficulty] = useState("all");
  const [newCategoryId, setNewCategoryId] = useState("");

  // Fetch Categories
  const { data: categories = [] } = useQuery<ICategory[]>({
    queryKey: ["admin_categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    },
  });

  // Fetch Courses
  const { data, isLoading } = useQuery({
    queryKey: ["admin_courses", page, search, statusFilter, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        status: statusFilter,
      });
      if (search.trim()) params.set("q", search.trim());
      if (categoryFilter) params.set("categoryId", categoryFilter);

      const res = await fetch(`/api/admin/courses?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch courses");
      const json = await res.json();
      return json.data;
    },
  });

  // Create Course Mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          subtitle: newSubtitle.trim() || undefined,
          difficulty: newDifficulty,
          categoryIds: newCategoryId ? [newCategoryId] : [],
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Creation failed");
      return json.data;
    },
    onSuccess: (course: ICourse) => {
      toast.success("Course Created", { description: "Launching course builder..." });
      setIsCreateOpen(false);
      router.push(`/admin/courses/${course._id.toString()}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Delete Course Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to delete course");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Course Archived");
      queryClient.invalidateQueries({ queryKey: ["admin_courses"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const coursesList: ICourse[] = data?.items || [];
  const totalCourses = data?.total || 0;

  const formatDuration = (totalSec: number) => {
    if (!totalSec) return "0m";
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">Courses Catalogue</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#121824] border border-[#1e293b] text-xs font-mono text-[#6366f1]">
              {totalCourses} Courses
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Build quantitative curriculum, manage encrypted video lectures, and drip rules
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white text-xs font-semibold hover:opacity-95 transition-all shadow-md shadow-[#6366f1]/25 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Course</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-3 rounded-2xl bg-[#0b0f17] border border-[#1e293b] flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses by title or tags..."
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
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-[#cbd5e1] focus:outline-none focus:border-[#6366f1]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id.toString()} value={c._id.toString()}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid / Table */}
      <div className="rounded-2xl bg-[#0b0f17] border border-[#1e293b] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1e293b] bg-[#121824]/60 text-[#64748b] uppercase tracking-wider font-mono">
                <th className="p-3.5">Course Title & Slug</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Curriculum</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Students</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#94a3b8]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#6366f1]" />
                    <p className="mt-2 text-xs">Loading course catalog...</p>
                  </td>
                </tr>
              ) : coursesList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#64748b]">
                    <BookOpen className="w-8 h-8 mx-auto text-[#334155] mb-2" />
                    <p className="text-sm font-semibold text-[#94a3b8]">No courses found</p>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      Create your first institutional trading course.
                    </p>
                  </td>
                </tr>
              ) : (
                coursesList.map((course) => (
                  <tr
                    key={course._id.toString()}
                    className="hover:bg-[#121824]/50 transition-colors"
                  >
                    {/* Course Title */}
                    <td className="p-3.5">
                      <Link
                        href={`/admin/courses/${course._id.toString()}`}
                        className="font-bold text-white hover:text-[#6366f1] transition-colors block text-sm"
                      >
                        {course.title}
                      </Link>
                      <div className="text-[11px] font-mono text-[#64748b] mt-0.5">
                        /{course.slug}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3.5">
                      {course.categoryIds && (course.categoryIds as any[]).length > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(course.categoryIds as any[]).map((cat) => (
                            <span
                              key={cat._id || cat}
                              className="px-2 py-0.5 rounded-md bg-[#121824] border border-[#1e293b] text-[11px] text-[#cbd5e1]"
                            >
                              {cat.name || "Category"}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[#64748b]">—</span>
                      )}
                    </td>

                    {/* Curriculum Counts */}
                    <td className="p-3.5 font-mono text-[#cbd5e1]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[#94a3b8]">
                          <Layers className="w-3.5 h-3.5 text-[#6366f1]" />
                          <span>{course.stats?.moduleCount || 0} Modules</span>
                        </span>
                        <span className="flex items-center gap-1 text-[#94a3b8]">
                          <Video className="w-3.5 h-3.5 text-[#10b981]" />
                          <span>{course.stats?.lectureCount || 0} Lectures</span>
                        </span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="p-3.5 font-mono text-[#94a3b8]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#64748b]" />
                        <span>{formatDuration(course.stats?.totalDurationSec || 0)}</span>
                      </div>
                    </td>

                    {/* Enrolled Students */}
                    <td className="p-3.5 font-mono text-[#94a3b8]">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#64748b]" />
                        <span>{course.stats?.enrolledCount || 0}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${
                          course.status === "published"
                            ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30"
                            : course.status === "archived"
                            ? "bg-red-500/10 text-red-400 border-red-500/30"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            course.status === "published"
                              ? "bg-[#10b981] animate-pulse"
                              : course.status === "archived"
                              ? "bg-red-400"
                              : "bg-yellow-400"
                          }`}
                        />
                        <span>{course.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right space-x-1.5">
                      <Link
                        href={`/admin/courses/${course._id.toString()}`}
                        title="Open Builder"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#6366f1]/15 text-[#6366f1] hover:bg-[#6366f1]/25 font-semibold text-[11px] transition-colors"
                      >
                        <span>Builder</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <button
                        onClick={() => {
                          if (confirm(`Archive course '${course.title}'?`)) {
                            deleteMutation.mutate(course._id.toString());
                          }
                        }}
                        title="Delete Course"
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-red-400 hover:bg-[#121824] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE COURSE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0b0f17] border border-[#1e293b] rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-5 right-5 text-[#64748b] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Create New Course</h2>
            <p className="text-xs text-[#94a3b8] mb-5">
              Initialize course title and structure for the curriculum builder
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate();
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-[#cbd5e1] font-medium mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quantitative Order Flow & Volume Profile"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-[#cbd5e1] font-medium mb-1">Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Master institutional liquidity dynamics and auction market theory"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cbd5e1] font-medium mb-1">Primary Category</label>
                  <select
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
                  >
                    <option value="">None / Unassigned</option>
                    {categories.map((c) => (
                      <option key={c._id.toString()} value={c._id.toString()}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#cbd5e1] font-medium mb-1">Difficulty Level</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#94a3b8] hover:bg-[#121824]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || !newTitle.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {createMutation.isPending && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>Create & Open Builder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
