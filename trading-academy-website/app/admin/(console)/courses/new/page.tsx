"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim() || undefined,
          difficulty,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to create course");

      toast.success("Course Created", { description: "Opening course builder..." });
      router.push(`/admin/courses/${json.data._id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Creation failed";
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Courses</span>
      </Link>

      <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0f17] border border-[#1e293b] shadow-xl">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Create New Course</h1>
        <p className="text-xs text-[#94a3b8] mb-6">
          Set up the title and target difficulty to initialize your curriculum builder
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#cbd5e1] font-medium mb-1">Course Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Quantitative Market Structure & Price Action"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#6366f1]"
            />
          </div>

          <div>
            <label className="block text-[#cbd5e1] font-medium mb-1">Subtitle (optional)</label>
            <input
              type="text"
              placeholder="e.g. Master liquidity hunts, imbalance voids, and algorithmic execution"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#6366f1]"
            />
          </div>

          <div>
            <label className="block text-[#cbd5e1] font-medium mb-1">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-[#121824] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#6366f1]"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="pt-4 border-t border-[#1e293b] flex items-center justify-end gap-3">
            <Link
              href="/admin/courses"
              className="px-4 py-2.5 text-xs text-[#94a3b8] hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#6366f1]/25 hover:opacity-95 disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Create & Open Builder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
