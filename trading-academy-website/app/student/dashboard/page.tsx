"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Shield,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Loader2,
  Award,
  Sparkles,
} from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";

export default function StudentDashboardPage() {
  const { data: session } = useSession();

  const { data: dashboard, isLoading } = useQuery<{
    stats: {
      enrolledCoursesCount: number;
      lecturesCompletedCount: number;
      totalHoursWatched: string;
    };
    continueTarget: {
      courseId: string;
      courseTitle: string;
      courseSlug: string;
      lectureId: string;
      lectureTitle: string;
      resumeAtSec: number;
      durationSec: number;
    } | null;
    courses: any[];
    expiringSoon: { courseTitle: string; expiresAt: string }[];
  }>({
    queryKey: ["student_dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/student/dashboard");
      if (!res.ok) throw new Error("Failed to load student dashboard");
      const json = await res.json();
      return json.data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
        <p className="text-xs">Loading your learning workspace...</p>
      </div>
    );
  }

  const stats = dashboard?.stats || {
    enrolledCoursesCount: 0,
    lecturesCompletedCount: 0,
    totalHoursWatched: "0.0",
  };
  const continueTarget = dashboard?.continueTarget;
  const courses = dashboard?.courses || [];
  const expiringSoon = dashboard?.expiringSoon || [];

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-card via-muted/40 to-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-primary/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-success/15 border border-success/30 text-success text-[11px] font-semibold tracking-wide font-mono">
              {session?.user?.studentCode || "STUDENT"}
            </span>
            <span className="text-xs text-muted-foreground">&bull;</span>
            <span className="text-xs text-muted-foreground">Institutional Learning Workspace</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Welcome back, {session?.user?.name || "Student"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            Track your curriculum progress, resume your lectures, and build market mastery.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link href="/student/courses">
            <Button variant="primary" size="md" className="gap-2 shadow-xs">
              <BookOpen className="w-4 h-4" />
              <span>View All Courses</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Expiring Soon Banner (if any) */}
      {expiringSoon.length > 0 && (
        <div className="p-4 rounded-2xl bg-warning/10 border border-warning/30 flex items-center gap-3 text-xs text-warning">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <span className="font-semibold">Access Expiry Notice: </span>
            {expiringSoon.map((exp, idx) => (
              <span key={idx}>
                &quot;{exp.courseTitle}&quot; expires on {new Date(exp.expiresAt).toLocaleDateString()}
                {idx < expiringSoon.length - 1 ? ", " : "."}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Enrolled Courses</span>
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            {stats.enrolledCoursesCount}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <span className="text-success font-semibold">Active</span>
            <span>Licenses</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border hover:border-success/50 transition-colors shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Lectures Completed</span>
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            {stats.lecturesCompletedCount}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <Award className="w-3 h-3 text-success" />
            <span>Passed Thresholds</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border hover:border-info/50 transition-colors shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Hours Learned</span>
            <Clock className="w-4 h-4 text-info" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            {stats.totalHoursWatched}h
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-info" />
            <span>Unique Watched Time</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border hover:border-success/50 transition-colors shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Device Security</span>
            <Shield className="w-4 h-4 text-success" />
          </div>
          <div className="text-sm font-bold text-success flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Single-Device Active</span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-2 font-mono truncate">
            {session?.user?.studentCode} Verified
          </div>
        </div>
      </div>

      {/* Continue Learning Hero Card */}
      {continueTarget && (
        <div className="p-6 sm:p-7 rounded-3xl bg-linear-to-r from-card via-muted/30 to-card border border-primary/30 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Continue Learning</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {continueTarget.lectureTitle}
              </h2>
              <p className="text-xs text-muted-foreground">
                From course: <strong className="text-foreground">{continueTarget.courseTitle}</strong>
              </p>
              {continueTarget.resumeAtSec > 0 && (
                <div className="text-xs font-mono text-success flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Resume at {Math.floor(continueTarget.resumeAtSec / 60)}m{" "}
                    {Math.floor(continueTarget.resumeAtSec % 60)}s
                  </span>
                </div>
              )}
            </div>

            <Link
              href={`/student/courses/${continueTarget.courseId}`}
              className="px-6 py-3 rounded-2xl bg-success text-success-foreground text-xs font-bold hover:opacity-95 transition-all shadow-md flex items-center gap-2 self-start md:self-auto shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Lecture</span>
            </Link>
          </div>
        </div>
      )}

      {/* My Enrolled Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>My Enrolled Courses</span>
          </h2>
          <Link
            href="/student/courses"
            className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Enrolled Courses Yet"
            description="Your account has not been enrolled in any trading courses yet. Contact your instructor or administration for course access grants."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((en) => {
              const course = en.courseId;
              const percent = en.progress?.percent || 0;

              return (
                <div
                  key={en._id}
                  className="rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col justify-between overflow-hidden group shadow-xs hover:shadow-md"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold capitalize">
                        {course?.difficulty || "Comprehensive"}
                      </span>
                      <span className="text-muted-foreground font-mono">
                        {en.expiresAt ? `Expires: ${new Date(en.expiresAt).toLocaleDateString()}` : "Lifetime Access"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {course?.title || "Trading Curriculum"}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {course?.subtitle || "Institute of Trading Tricks specialized course"}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-muted-foreground">Curriculum Progress</span>
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
                          {en.progress?.completedLectures || 0} of {en.progress?.totalLectures || course?.stats?.lectureCount || 0} lectures
                        </span>
                        {percent === 100 && (
                          <span className="text-success font-semibold">Completed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/40 border-t border-border flex items-center justify-between">
                    <div className="text-[11px] text-muted-foreground">
                      {course?.authorId?.name ? `By ${course.authorId.name}` : "Institute Instructors"}
                    </div>
                    <Link
                      href={`/student/courses/${course?._id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
