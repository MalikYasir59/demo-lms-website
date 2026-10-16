"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Search,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

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
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <span>My Enrolled Courses</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Access your assigned institutional trading curriculums and track your completion
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search enrolled courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card border border-input rounded-xl pl-9 pr-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary w-56 sm:w-64"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-card border border-input rounded-xl px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary"
          >
            <option value="all">All Courses</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
          <p className="text-xs">Loading course enrollments...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Courses Found"
          description={search ? "No courses matched your search query." : "You are not enrolled in any courses in this category."}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((en) => {
            const course = en.courseId;
            const percent = en.progress?.percent || 0;
            const isCompleted = percent >= 100;

            return (
              <div
                key={en._id}
                className="rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md group"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold capitalize">
                      {course?.difficulty || "Comprehensive"}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-success font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {en.expiresAt ? `Expires ${new Date(en.expiresAt).toLocaleDateString()}` : "Lifetime Access"}
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {course?.title || "Trading Curriculum"}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {course?.subtitle || "Master the financial markets with specialized institutional strategies"}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-bold text-foreground">{percent}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-linear-to-r from-primary to-success h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-muted-foreground flex justify-between font-mono pt-0.5">
                      <span>
                        {en.progress?.completedLectures || 0} / {en.progress?.totalLectures || course?.stats?.lectureCount || 0} Lectures
                      </span>
                      <span>
                        {Math.floor((course?.stats?.totalDurationSec || 0) / 3600)}h total
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/40 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Enrolled {new Date(en.startsAt).toLocaleDateString()}</span>
                  </div>
                  <Link
                    href={`/student/courses/${course?._id}`}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-95 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
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
