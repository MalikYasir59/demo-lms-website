"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  AlertCircle,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function StudentCourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const { data, isLoading, error } = useQuery<{
    course: any;
    enrollment: any;
    modules: any[];
  }>({
    queryKey: ["student_course_detail", courseId],
    queryFn: async () => {
      const res = await fetch(`/api/student/courses/${courseId}`);
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message || "Failed to load course");
      }
      const json = await res.json();
      return json.data;
    },
  });

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-[#94a3b8]">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#6366f1] mb-2" />
        <p className="text-xs">Loading course syllabus and progress...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-12 rounded-3xl bg-[#0b0f17] border border-[#1e293b] text-center max-w-lg mx-auto space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Course Access Restricted</h2>
        <p className="text-xs text-[#94a3b8] leading-relaxed">
          {error instanceof Error ? error.message : "You do not have active enrollment access for this curriculum."}
        </p>
        <Link
          href="/student/courses"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#121824] border border-[#1e293b] text-xs font-semibold text-white hover:border-[#6366f1]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Courses</span>
        </Link>
      </div>
    );
  }

  const { course, enrollment, modules } = data;
  const percent = enrollment.progress?.percent || 0;

  // Find first incomplete unlocked lecture to resume
  const allLectures = modules.flatMap((m) => m.lectures || []);
  const firstIncompleteUnlocked = allLectures.find(
    (l) => l.unlocked && l.progress?.status !== "completed"
  ) || allLectures[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/student/courses"
        className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to My Courses</span>
      </Link>

      {/* Course Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0f17] border border-[#1e293b] space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#6366f1]/15 text-[#6366f1] text-[11px] font-semibold capitalize border border-[#6366f1]/30">
                {course.difficulty} Level
              </span>
              {course.authorId?.name && (
                <span className="text-xs text-[#64748b]">
                  Instructor: <strong className="text-white">{course.authorId.name}</strong>
                </span>
              )}
              <span className="text-[#334155]">&bull;</span>
              <span className="text-xs font-mono text-[#64748b]">
                {enrollment.expiresAt
                  ? `Access until ${new Date(enrollment.expiresAt).toLocaleDateString()}`
                  : "Lifetime Access"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {course.title}
            </h1>

            {course.subtitle && (
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                {course.subtitle}
              </p>
            )}
          </div>

          {/* Action CTA */}
          {firstIncompleteUnlocked && (
            <Link
              href={`/student/learn/${firstIncompleteUnlocked._id}`}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#10b981] to-[#059669] text-black text-xs font-bold hover:opacity-95 transition-all shadow-lg shadow-[#10b981]/20 flex items-center gap-2 shrink-0 self-start lg:self-auto cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>{percent > 0 ? "Resume Learning" : "Start Course"}</span>
            </Link>
          )}
        </div>

        {/* Progress Bar & Denormalized Stats */}
        <div className="pt-4 border-t border-[#1e293b]/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#94a3b8] flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#6366f1]" />
              <span>Overall Course Completion</span>
            </span>
            <span className="font-bold text-white text-sm">{percent}%</span>
          </div>

          <div className="w-full bg-[#121824] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#6366f1] via-[#818cf8] to-[#10b981] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#64748b] font-mono pt-1">
            <span>
              {enrollment.progress?.completedLectures || 0} of {enrollment.progress?.totalLectures || course.stats?.lectureCount || 0} Lectures Finished
            </span>
            <span>
              {Math.floor((course.stats?.totalDurationSec || 0) / 3600)}h {Math.floor(((course.stats?.totalDurationSec || 0) % 3600) / 60)}m Total Runtime
            </span>
          </div>
        </div>
      </div>

      {/* Curriculum Syllabus Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#6366f1]" />
            <span>Curriculum & Lectures</span>
          </h2>
          <span className="text-xs text-[#64748b] font-mono">
            {modules.length} Chapters &bull; {allLectures.length} Video Lessons
          </span>
        </div>

        <div className="space-y-3">
          {modules.map((mod, modIdx) => {
            const isExpanded = expandedModules[mod._id.toString()] ?? true;
            const completedInModule = mod.lectures?.filter((l: any) => l.progress?.status === "completed").length || 0;
            const totalInModule = mod.lectures?.length || 0;

            return (
              <div
                key={mod._id}
                className="rounded-2xl bg-[#0b0f17] border border-[#1e293b] overflow-hidden transition-all"
              >
                {/* Module Header Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleModule(mod._id.toString())}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-[#121824]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-[#121824] border border-[#1e293b] flex items-center justify-center text-xs font-mono font-bold text-[#6366f1]">
                      {modIdx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base">{mod.title}</h3>
                      {mod.description && (
                        <p className="text-xs text-[#64748b] mt-0.5 line-clamp-1">
                          {mod.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs font-mono text-[#64748b]">
                      {completedInModule}/{totalInModule} done
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#94a3b8]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
                    )}
                  </div>
                </button>

                {/* Lectures List */}
                {isExpanded && (
                  <div className="divide-y divide-[#1e293b]/40 border-t border-[#1e293b]/60 bg-[#07090e]/60">
                    {!mod.lectures || mod.lectures.length === 0 ? (
                      <div className="p-4 text-center text-xs text-[#64748b]">
                        No published lectures in this chapter.
                      </div>
                    ) : (
                      mod.lectures.map((lec: any, lIdx: number) => {
                        const isCompleted = lec.progress?.status === "completed";
                        const inProgress = !isCompleted && lec.progress?.percent > 0;
                        const isLocked = !lec.unlocked;

                        return (
                          <div
                            key={lec._id}
                            className={`p-3.5 sm:p-4 flex items-center justify-between gap-4 transition-colors ${
                              isLocked
                                ? "opacity-50 bg-[#07090e]/30"
                                : "hover:bg-[#121824]/50"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Status Icon */}
                              {isCompleted ? (
                                <div className="w-8 h-8 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center shrink-0 text-[#10b981]">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                              ) : inProgress ? (
                                <div className="w-8 h-8 rounded-xl bg-[#6366f1]/15 border border-[#6366f1]/30 flex items-center justify-center shrink-0 text-[#6366f1]">
                                  <Play className="w-4 h-4 fill-[#6366f1]" />
                                </div>
                              ) : isLocked ? (
                                <div className="w-8 h-8 rounded-xl bg-[#1e293b]/50 border border-[#1e293b] flex items-center justify-center shrink-0 text-[#64748b]">
                                  <Lock className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-xl bg-[#121824] border border-[#1e293b] flex items-center justify-center shrink-0 text-[#94a3b8]">
                                  <Play className="w-3.5 h-3.5" />
                                </div>
                              )}

                              {/* Title & Metadata */}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-mono text-[#64748b]">
                                    {lIdx + 1}.
                                  </span>
                                  <h4 className="font-semibold text-white text-xs sm:text-sm truncate">
                                    {lec.title}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-2.5 text-[11px] font-mono text-[#64748b] mt-0.5">
                                  <span>
                                    {Math.floor(lec.durationSec / 60)}m {lec.durationSec % 60}s
                                  </span>
                                  {lec.resourcesCount > 0 && (
                                    <>
                                      <span>&bull;</span>
                                      <span className="flex items-center gap-1 text-[#94a3b8]">
                                        <FileText className="w-3 h-3" />
                                        <span>{lec.resourcesCount} attachments</span>
                                      </span>
                                    </>
                                  )}
                                  {isLocked && lec.lockReason && (
                                    <>
                                      <span>&bull;</span>
                                      <span className="text-amber-400 font-sans">{lec.lockReason}</span>
                                    </>
                                  )}
                                  {inProgress && (
                                    <>
                                      <span>&bull;</span>
                                      <span className="text-[#6366f1]">{lec.progress.percent}% watched</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Lecture Action Button */}
                            <div className="shrink-0">
                              {isLocked ? (
                                <span className="px-3 py-1 rounded-lg bg-[#121824] text-[#64748b] text-[11px] font-medium flex items-center gap-1 cursor-not-allowed">
                                  <Lock className="w-3 h-3" />
                                  <span>Locked</span>
                                </span>
                              ) : (
                                <Link
                                  href={`/student/learn/${lec._id}`}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    isCompleted
                                      ? "bg-[#121824] text-[#94a3b8] hover:text-white hover:bg-[#1e293b]"
                                      : inProgress
                                      ? "bg-[#6366f1] text-white hover:bg-[#4f46e5] shadow-md shadow-[#6366f1]/20"
                                      : "bg-[#10b981]/15 text-[#10b981] hover:bg-[#10b981]/25 border border-[#10b981]/30"
                                  }`}
                                >
                                  <Play className="w-3 h-3" />
                                  <span>{isCompleted ? "Rewatch" : inProgress ? "Resume" : "Play"}</span>
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
