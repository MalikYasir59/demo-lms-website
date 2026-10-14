"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export default function StudentCoursesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "in_progress" | "completed">("all");

  const { data: enrollments = [], isLoading } = useQuery<any[]>({
    queryKey: ["student_courses_list"],
    queryFn: async () => {
      const res = await fetch("/api/student/courses");
      if (!res.ok) throw new Error("Failed to load courses");
      const json = await res.json();
      return json.data || [];
    },
  });

  const filteredCourses = enrollments.filter((en) => {
    const title = en.courseId?.title?.toLowerCase() || "";
    const matchesSearch = !search.trim() || title.includes(search.toLowerCase().trim());

    const percent = en.progress?.percent || 0;
    if (filter === "completed") {
      return matchesSearch && percent >= 100;
    }
    if (filter === "in_progress") {
      return matchesSearch && percent < 100;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#6366f1]" />
            <span>My Enrolled Courses</span>
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1">
            Access your assigned institutional trading curriculums and track your completion
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search enrolled courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0b0f17] border border-[#1e293b] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1] w-56 sm:w-64"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-[#0b0f17] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1]"
          >
            <option value="all">All Courses</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-[#94a3b8]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#6366f1] mb-2" />
          <p className="text-xs">Loading course enrollments...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-16 rounded-3xl bg-[#0b0f17] border border-[#1e293b] text-center">
          <BookOpen className="w-10 h-10 text-[#334155] mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Courses Found</h3>
          <p className="text-xs text-[#64748b] max-w-sm mx-auto mt-1">
            {search ? "No courses matched your search query." : "You are not enrolled in any courses in this category."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((en) => {
            const course = en.courseId;
            const percent = en.progress?.percent || 0;
            const isCompleted = percent >= 100;

            return (
              <div
                key={en._id}
                className="rounded-2xl bg-[#0b0f17] border border-[#1e293b] hover:border-[#6366f1]/40 transition-all flex flex-col justify-between overflow-hidden shadow-lg group"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#6366f1]/15 text-[#6366f1] font-semibold capitalize">
                      {course?.difficulty || "Comprehensive"}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[#10b981] font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-[#64748b] font-mono text-[11px]">
                        {en.expiresAt ? `Expires ${new Date(en.expiresAt).toLocaleDateString()}` : "Lifetime Access"}
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-white group-hover:text-[#6366f1] transition-colors line-clamp-2">
                      {course?.title || "Trading Curriculum"}
                    </h2>
                    <p className="text-xs text-[#64748b] mt-1 line-clamp-2">
                      {course?.subtitle || "Master the financial markets with specialized institutional strategies"}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#94a3b8]">Completion</span>
                      <span className="font-bold text-white">{percent}%</span>
                    </div>
                    <div className="w-full bg-[#121824] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#6366f1] to-[#10b981] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-[#64748b] flex justify-between font-mono pt-0.5">
                      <span>
                        {en.progress?.completedLectures || 0} / {en.progress?.totalLectures || course?.stats?.lectureCount || 0} Lectures
                      </span>
                      <span>
                        {Math.floor((course?.stats?.totalDurationSec || 0) / 3600)}h total
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#121824]/50 border-t border-[#1e293b]/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Enrolled {new Date(en.startsAt).toLocaleDateString()}</span>
                  </div>
                  <Link
                    href={`/student/courses/${course?._id}`}
                    className="px-4 py-2 rounded-xl bg-[#6366f1] text-white hover:bg-[#4f46e5] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-[#6366f1]/20 cursor-pointer"
                  >
                    <span>{percent > 0 ? "Resume" : "Start"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
