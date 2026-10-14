"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Users,
  BookOpen,
  Clock,
  ShieldAlert,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { MetricCard } from "@/components/analytics/MetricCard";
import { AreaTrendChart } from "@/components/analytics/AreaTrendChart";
import { BarMetricsChart } from "@/components/analytics/BarMetricsChart";
import { ActivityHeatmap } from "@/components/analytics/ActivityHeatmap";

type AnalyticsTab = "overview" | "students" | "courses" | "engagement" | "security";

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");

  // Overview Data
  const [overviewData, setOverviewData] = useState<{
    timeline: Array<{ date: string; watchHours: number; sessionsCount: number; activeLearners: number }>;
    topCourses: Array<{ courseId: string; title: string; watchHours: number; activeLearners: number }>;
    categoryMix: Array<{ categoryId: string; name: string; courseCount: number }>;
  } | null>(null);

  // Students Data
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState("all");

  // Courses Data
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courseDetailData, setCourseDetailData] = useState<any | null>(null);

  // Engagement Data
  const [engagementData, setEngagementData] = useState<{
    dau: number;
    wau: number;
    mau: number;
    dauToMauRatio: number;
    heatmap: Array<{ day: number; hour: number; count: number }>;
  } | null>(null);

  // Security Data
  const [securityData, setSecurityData] = useState<{
    byType: Array<{ type: string; count: number; avgScore: number }>;
    bySeverity: Array<{ severity: string; count: number }>;
    flaggedStudents: any[];
    topIncidentLectures: any[];
  } | null>(null);

  // Fetch data per tab
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      try {
        if (activeTab === "overview") {
          const res = await fetch(`/api/admin/analytics/overview?range=${dateRange}`);
          const json = await res.json();
          if (json.ok && isMounted) setOverviewData(json.data);
        } else if (activeTab === "students") {
          const res = await fetch(
            `/api/admin/analytics/students?q=${encodeURIComponent(studentSearch)}&status=${studentStatusFilter}`
          );
          const json = await res.json();
          if (json.ok && isMounted) setStudentsData(json.data.items);
        } else if (activeTab === "courses") {
          const res = await fetch("/api/admin/analytics/courses");
          const json = await res.json();
          if (json.ok && isMounted) {
            setCoursesData(json.data);
            if (json.data.length > 0 && !selectedCourseId) {
              setSelectedCourseId(json.data[0].id);
            }
          }
        } else if (activeTab === "engagement") {
          const res = await fetch("/api/admin/analytics/engagement");
          const json = await res.json();
          if (json.ok && isMounted) setEngagementData(json.data);
        } else if (activeTab === "security") {
          const res = await fetch("/api/admin/analytics/security");
          const json = await res.json();
          if (json.ok && isMounted) setSecurityData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeTab, dateRange, studentSearch, studentStatusFilter]);

  // Fetch course detail funnel when course selected
  useEffect(() => {
    if (!selectedCourseId || activeTab !== "courses") return;

    fetch(`/api/admin/analytics/courses/${selectedCourseId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setCourseDetailData(res.data);
      })
      .catch((err) => console.error(err));
  }, [selectedCourseId, activeTab]);

  const handleExportCsv = () => {
    const exportType = activeTab === "courses" ? "courses" : "students";
    window.location.href = `/api/admin/analytics/export?type=${exportType}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Institutional Intelligence & Analytics
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30 font-mono">
              Live & Nightly Rollups
            </span>
          </div>
          <p className="text-sm text-[#94a3b8] mt-1">
            Real-time engagement telemetry, student progression funnels, and forensic security audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#0b0f17] border border-[#1e293b] text-white text-xs font-mono focus:outline-none focus:border-[#6366f1]"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-[#121824] hover:bg-[#1e293b] text-white text-xs font-medium border border-[#1e293b] flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#6366f1]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 overflow-x-auto">
        {(
          [
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "students", label: "Student Leaderboard", icon: Users },
            { id: "courses", label: "Course Funnels", icon: BookOpen },
            { id: "engagement", label: "DAU / Peak Hours", icon: Clock },
            { id: "security", label: "Security & Incidents", icon: ShieldAlert },
          ] as const
        ).map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25"
                  : "text-[#94a3b8] hover:text-white hover:bg-[#121824]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-12 text-center">
          <RefreshCw className="w-6 h-6 animate-spin text-[#6366f1] mx-auto mb-2" />
          <p className="text-xs text-[#94a3b8] font-mono">Aggregating telemetry records...</p>
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {!loading && activeTab === "overview" && overviewData && (
        <div className="space-y-6">
          {/* Main Trend Chart */}
          <div className="p-6 rounded-2xl bg-[#0b0f17] border border-[#1e293b] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Daily Watch Hours Timeline</h3>
                <p className="text-xs text-[#64748b]">Total streaming hours logged by enrolled students</p>
              </div>
              <span className="text-xs font-mono text-[#6366f1] bg-[#6366f1]/10 px-2.5 py-1 rounded-lg border border-[#6366f1]/20">
                M0 Real-time Stream
              </span>
            </div>
            <AreaTrendChart
              data={overviewData.timeline.map((t) => ({
                date: t.date,
                value: t.watchHours,
              }))}
              unit="h"
              color="#6366f1"
              height={260}
            />
          </div>

          {/* Grid: Top Courses & Category Mix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Courses */}
            <div className="p-6 rounded-2xl bg-[#0b0f17] border border-[#1e293b]">
              <h3 className="text-sm font-semibold text-white mb-1">Top Courses by Watch Time</h3>
              <p className="text-xs text-[#64748b] mb-4">Most engaged academy curricula</p>
              <BarMetricsChart
                data={overviewData.topCourses.map((c) => ({
                  label: c.title,
                  value: c.watchHours,
                }))}
                unit="h"
                color="#10b981"
                height={220}
              />
            </div>

            {/* Category Mix */}
            <div className="p-6 rounded-2xl bg-[#0b0f17] border border-[#1e293b]">
              <h3 className="text-sm font-semibold text-white mb-1">Curriculum Distribution</h3>
              <p className="text-xs text-[#64748b] mb-4">Courses published by category</p>
              <BarMetricsChart
                data={overviewData.categoryMix.map((c) => ({
                  label: c.name,
                  value: c.courseCount,
                }))}
                unit=" courses"
                color="#f59e0b"
                height={220}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENTS LEADERBOARD */}
      {!loading && activeTab === "students" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 rounded-xl bg-[#0b0f17] border border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, email, student code..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#121824] border border-[#1e293b] text-white text-xs focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-[#64748b] font-mono">Status:</span>
              <select
                value={studentStatusFilter}
                onChange={(e) => setStudentStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#121824] border border-[#1e293b] text-white text-xs font-mono focus:outline-none"
              >
                <option value="all">All Students</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="rounded-2xl bg-[#0b0f17] border border-[#1e293b] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1e293b] bg-[#121824]/50 text-[11px] font-mono text-[#64748b] uppercase tracking-wider">
                    <th className="p-4">Student</th>
                    <th className="p-4">Code</th>
                    <th className="p-4">Progress</th>
                    <th className="p-4">Watch Time</th>
                    <th className="p-4">Active Days</th>
                    <th className="p-4">Engagement</th>
                    <th className="p-4">Risk Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b] text-xs">
                  {studentsData.map((s) => (
                    <tr key={s.id} className="hover:bg-[#121824]/30 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-white">{s.name}</div>
                        <div className="text-[11px] text-[#64748b]">{s.email}</div>
                      </td>
                      <td className="p-4 font-mono text-[#94a3b8]">{s.studentCode || "—"}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-[#1e293b] rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#10b981] h-full rounded-full"
                              style={{ width: `${s.avgProgress}%` }}
                            />
                          </div>
                          <span className="font-mono text-[#10b981] text-[11px]">
                            {s.avgProgress}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-white">{s.watchedHours}h</td>
                      <td className="p-4 font-mono text-[#94a3b8]">{s.activeDays} days</td>
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6366f1]/15 text-[#6366f1] font-mono text-[11px]">
                          <Flame className="w-3 h-3" />
                          <span>{s.engagementScore} / 100</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {s.riskFlag === "security-flag" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] text-[11px] font-mono">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Security Alert</span>
                          </span>
                        ) : s.riskFlag === "at-risk" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] text-[11px] font-mono">
                            <span>At Risk</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] text-[11px] font-mono">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Healthy</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/students/${s.id}`}
                          className="px-2.5 py-1 rounded-lg bg-[#121824] hover:bg-[#1e293b] text-white text-[11px] font-medium border border-[#1e293b] inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Profile</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {studentsData.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-[#64748b]">
                        No students found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COURSE FUNNELS & DROP-OFF */}
      {!loading && activeTab === "courses" && (
        <div className="space-y-6">
          {/* Courses Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coursesData.map((c) => {
              const isSelected = selectedCourseId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCourseId(c.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#121824] border-[#6366f1] ring-1 ring-[#6366f1]"
                      : "bg-[#0b0f17] border-[#1e293b] hover:border-[#334155]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e293b] text-[#94a3b8]">
                      {c.difficulty || "All Levels"}
                    </span>
                    <span className="text-xs font-mono text-[#10b981]">
                      {c.completionRate}% completed
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white truncate">{c.title}</h4>
                  <div className="mt-3 flex items-center justify-between text-xs text-[#64748b] font-mono">
                    <span>{c.totalEnrolled} enrolled</span>
                    <span>{c.totalWatchHours}h logged</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Course Details: Module Funnel & Drop-off Ranked Table */}
          {courseDetailData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Module Funnel */}
              <div className="p-6 rounded-2xl bg-[#0b0f17] border border-[#1e293b]">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Module Progression Funnel
                </h3>
                <p className="text-xs text-[#64748b] mb-4">
                  Conversion rate of enrolled learners completing each module
                </p>

                <div className="space-y-3">
                  {courseDetailData.moduleFunnel.map((mod: any, idx: number) => (
                    <div key={mod.moduleId} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white font-medium">
                          {idx + 1}. {mod.title}
                        </span>
                        <span className="font-mono text-[#6366f1] text-[11px]">
                          {mod.conversionPct}% ({mod.learnersCompleted} learners)
                        </span>
                      </div>
                      <div className="w-full bg-[#1e293b] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] h-full rounded-full transition-all duration-500"
                          style={{ width: `${mod.conversionPct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {courseDetailData.moduleFunnel.length === 0 && (
                    <p className="text-xs text-[#64748b]">No module data recorded.</p>
                  )}
                </div>
              </div>

              {/* Lecture Drop-off Ranked Table */}
              <div className="p-6 rounded-2xl bg-[#0b0f17] border border-[#1e293b]">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Highest Lecture Drop-off Points
                </h3>
                <p className="text-xs text-[#64748b] mb-4">
                  Lectures where learners most frequently stop watching
                </p>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {courseDetailData.lectureDropoff.map((l: any) => (
                    <div
                      key={l.lectureId}
                      className="p-3 rounded-xl bg-[#121824] border border-[#1e293b] flex items-center justify-between"
                    >
                      <div className="truncate max-w-[240px]">
                        <div className="text-xs font-medium text-white truncate">{l.title}</div>
                        <div className="text-[10px] text-[#64748b] font-mono">
                          {l.starts} starts · {l.completions} completions
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-xs font-mono font-bold ${
                            l.dropoffPct > 40
                              ? "text-[#ef4444]"
                              : l.dropoffPct > 20
                              ? "text-[#f59e0b]"
                              : "text-[#10b981]"
                          }`}
                        >
                          {l.dropoffPct}% Drop
                        </div>
                        <div className="text-[10px] text-[#64748b] font-mono">
                          Avg: {l.avgWatchPct}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ENGAGEMENT (DAU / WAU / MAU & HEATMAP) */}
      {!loading && activeTab === "engagement" && engagementData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <MetricCard
              title="Daily Active (DAU)"
              value={engagementData.dau}
              subtitle="Active in last 24h"
              icon={Users}
              iconColor="text-[#6366f1]"
            />
            <MetricCard
              title="Weekly Active (WAU)"
              value={engagementData.wau}
              subtitle="Active in last 7 days"
              icon={Users}
              iconColor="text-[#10b981]"
            />
            <MetricCard
              title="Monthly Active (MAU)"
              value={engagementData.mau}
              subtitle="Active in last 30 days"
              icon={Users}
              iconColor="text-[#f59e0b]"
            />
            <MetricCard
              title="DAU / MAU Stickiness"
              value={`${engagementData.dauToMauRatio}%`}
              subtitle="Platform retention ratio"
              icon={TrendingUp}
              iconColor="text-[#ec4899]"
            />
          </div>

          {/* 7x24 Matrix */}
          <div className="p-6 rounded-2xl bg-[#0b0f17] border border-[#1e293b] shadow-xl">
            <h3 className="text-sm font-semibold text-white mb-1">Peak Streaming Hours</h3>
            <p className="text-xs text-[#64748b] mb-4">
              Heatmap of student viewer sessions across hour of day and day of week
            </p>
            <ActivityHeatmap data={engagementData.heatmap} />
          </div>
        </div>
      )}

      {/* TAB 5: SECURITY & INCIDENTS */}
      {!loading && activeTab === "security" && securityData && (
        <div className="space-y-6">
          {/* Incidents by Type and Severity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#0b0f17] border border-[#1e293b]">
              <h3 className="text-sm font-semibold text-white mb-1">Events by Anti-Piracy Probe</h3>
              <p className="text-xs text-[#64748b] mb-4">Triggered client & server detection rules</p>
              <div className="space-y-2.5">
                {securityData.byType.map((t) => (
                  <div
                    key={t.type}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#121824] border border-[#1e293b]"
                  >
                    <span className="text-xs font-mono text-white">{t.type}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#94a3b8]">
                        Avg Score: {t.avgScore}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] font-mono text-xs">
                        {t.count} hits
                      </span>
                    </div>
                  </div>
                ))}
                {securityData.byType.length === 0 && (
                  <p className="text-xs text-[#64748b]">No security events logged in last 30 days.</p>
                )}
              </div>
            </div>

            {/* Severity Distribution */}
            <div className="p-6 rounded-2xl bg-[#0b0f17] border border-[#1e293b]">
              <h3 className="text-sm font-semibold text-white mb-1">Incidents by Severity</h3>
              <p className="text-xs text-[#64748b] mb-4">Categorized response tier</p>
              <div className="grid grid-cols-2 gap-3">
                {securityData.bySeverity.map((s) => (
                  <div
                    key={s.severity}
                    className="p-4 rounded-xl bg-[#121824] border border-[#1e293b]"
                  >
                    <div className="text-xs font-mono uppercase text-[#64748b]">{s.severity}</div>
                    <div className="text-2xl font-bold font-mono text-white mt-1">{s.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flagged Students */}
          <div className="p-6 rounded-2xl bg-[#0b0f17] border border-[#1e293b]">
            <h3 className="text-sm font-semibold text-white mb-1">
              Flagged & Security Locked Students
            </h3>
            <p className="text-xs text-[#64748b] mb-4">
              Students exceeding strike score threshold (Score &ge; 3) or auto-locked
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1e293b] text-[#64748b] font-mono uppercase text-[11px]">
                    <th className="py-2.5">Student</th>
                    <th className="py-2.5">Code</th>
                    <th className="py-2.5">Strike Score</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {securityData.flaggedStudents.map((s) => (
                    <tr key={s.id}>
                      <td className="py-3">
                        <div className="font-medium text-white">{s.name}</div>
                        <div className="text-[#64748b] text-[11px]">{s.email}</div>
                      </td>
                      <td className="py-3 font-mono text-[#94a3b8]">{s.studentCode}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] font-mono text-xs">
                          {s.strikeScore} points
                        </span>
                      </td>
                      <td className="py-3">
                        {s.securityLocked ? (
                          <span className="text-[#ef4444] font-mono">LOCKED</span>
                        ) : (
                          <span className="text-[#f59e0b] font-mono">FLAGGED</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/students/${s.id}`}
                          className="px-2.5 py-1 rounded-lg bg-[#121824] hover:bg-[#1e293b] text-white text-[11px] border border-[#1e293b]"
                        >
                          Review & Unlock
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {securityData.flaggedStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[#64748b]">
                        Zero students currently flagged or locked. Anti-piracy shield nominal.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
