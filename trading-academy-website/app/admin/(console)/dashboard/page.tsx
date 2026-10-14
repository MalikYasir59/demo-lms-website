"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  Plus,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { MetricCard } from "@/components/analytics/MetricCard";
import { AreaTrendChart } from "@/components/analytics/AreaTrendChart";

interface DashboardData {
  kpis: {
    totalStudents: number;
    activeStudents: number;
    publishedCourses: number;
    activeEnrollments: number;
    watchHours30d: number;
    avgCompletionRate: number;
    expiringIn7Days: number;
    openSecurityAlerts: number;
  };
  trends: Array<{ date: string; watchHours: number; activeLearners: number }>;
  expiringEnrollments: Array<{
    id: string;
    studentName: string;
    studentEmail: string;
    studentCode: string;
    courseTitle: string;
    expiresAt: string;
  }>;
  recentAudits: Array<{
    id: string;
    action: string;
    summary: string;
    actorName: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (json.ok) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#121824] via-[#0b0f17] to-[#121824] border border-[#1e293b] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#6366f1]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/15 text-[#6366f1] border border-[#6366f1]/30 text-xs font-mono mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse" />
              <span>Institutional Academy Online</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Institute of Trading Tricks LMS
            </h1>
            <p className="text-sm text-[#94a3b8] mt-2 leading-relaxed">
              Institutional administrative command centre. Supervise student cohorts, video streaming telemetries, content drip sequences, and forensic security alerts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/students"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white text-xs font-semibold hover:opacity-95 transition-opacity shadow-lg shadow-[#6366f1]/25 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </Link>
            <Link
              href="/admin/courses"
              className="px-4 py-2.5 rounded-xl bg-[#121824] hover:bg-[#1e293b] text-white text-xs font-medium border border-[#1e293b] flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#10b981]" />
              <span>Courses Matrix</span>
            </Link>
            <button
              onClick={fetchDashboard}
              className="p-2.5 rounded-xl bg-[#121824] hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 8 Primary KPI Cards (Spec 8.3.1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Students"
          value={data?.kpis.totalStudents ?? "—"}
          subtitle={`${data?.kpis.activeStudents ?? 0} active in last 30d`}
          icon={Users}
          iconColor="text-[#6366f1]"
        />
        <MetricCard
          title="Published Courses"
          value={data?.kpis.publishedCourses ?? "—"}
          subtitle="Academy curriculum modules"
          icon={BookOpen}
          iconColor="text-[#10b981]"
        />
        <MetricCard
          title="Active Enrollments"
          value={data?.kpis.activeEnrollments ?? "—"}
          subtitle="Effective student licenses"
          icon={GraduationCap}
          iconColor="text-[#38bdf8]"
        />
        <MetricCard
          title="Watch Hours (30d)"
          value={data ? `${data.kpis.watchHours30d}h` : "—"}
          subtitle="Telemetry verified time"
          icon={Clock}
          iconColor="text-[#a855f7]"
        />
        <MetricCard
          title="Avg Completion"
          value={data ? `${data.kpis.avgCompletionRate}%` : "—"}
          subtitle="Enrolled completion rate"
          icon={CheckCircle2}
          iconColor="text-[#10b981]"
        />
        <MetricCard
          title="Expiring (7 Days)"
          value={data?.kpis.expiringIn7Days ?? "—"}
          subtitle="Enrollments ending soon"
          icon={AlertTriangle}
          iconColor="text-[#f59e0b]"
        />
        <MetricCard
          title="Security Alerts"
          value={data?.kpis.openSecurityAlerts ?? "—"}
          subtitle="Unresolved strike flags"
          icon={ShieldAlert}
          iconColor="text-[#ef4444]"
        />
        <Link
          href="/admin/analytics"
          className="p-5 rounded-2xl bg-[#0b0f17] border border-[#1e293b] hover:border-[#6366f1]/50 transition-colors group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#64748b] uppercase tracking-wider">
              Analytics Engine
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#121824] text-[#6366f1] flex items-center justify-center border border-[#1e293b] group-hover:scale-105 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-white">Full Intelligence</div>
            <div className="text-xs text-[#6366f1] mt-1 flex items-center gap-1">
              <span>View Leaderboards & Funnels &rarr;</span>
            </div>
          </div>
        </Link>
      </div>

      {/* 14-Day Activity Trends Area Chart */}
      <div className="p-6 rounded-2xl bg-[#0b0f17] border border-[#1e293b] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Academy Watch Time (Last 14 Days)</h3>
            <p className="text-xs text-[#64748b]">Daily cumulative hours streamed by students</p>
          </div>
          <span className="text-xs font-mono text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded-lg border border-[#10b981]/20">
            Real-Time Stream
          </span>
        </div>

        {data?.trends && (
          <AreaTrendChart
            data={data.trends.map((t) => ({
              date: t.date,
              value: t.watchHours,
            }))}
            unit="h"
            color="#6366f1"
            height={220}
          />
        )}
      </div>

      {/* Two Columns: Expiring Enrollments & Recent Audit Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Enrollments */}
        <div className="p-6 rounded-2xl bg-[#0b0f17] border border-[#1e293b] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Upcoming Expiring Enrollments</h3>
              <p className="text-xs text-[#64748b]">Licenses expiring in the next 7 days</p>
            </div>
            <Link
              href="/admin/students"
              className="text-xs text-[#6366f1] hover:underline font-mono"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {data?.expiringEnrollments.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#121824] border border-[#1e293b] flex items-center justify-between gap-3 hover:border-[#334155] transition-colors"
              >
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">
                    {item.studentName}
                  </div>
                  <div className="text-[11px] text-[#64748b] truncate">
                    {item.courseTitle}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] font-mono text-[#f59e0b]">
                    {new Date(item.expiresAt).toLocaleDateString()}
                  </div>
                  <Link
                    href={`/admin/students`}
                    className="text-[10px] text-[#6366f1] hover:underline font-mono"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
            {(!data?.expiringEnrollments || data.expiringEnrollments.length === 0) && (
              <div className="p-6 text-center text-xs text-[#64748b] font-mono border border-dashed border-[#1e293b] rounded-xl">
                No enrollments expiring within the next 7 days
              </div>
            )}
          </div>
        </div>

        {/* Recent Audit Feed */}
        <div className="p-6 rounded-2xl bg-[#0b0f17] border border-[#1e293b] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Recent System Audit Log</h3>
              <p className="text-xs text-[#64748b]">Administrative actions and credentials</p>
            </div>
            <Link
              href="/admin/settings"
              className="text-xs text-[#6366f1] hover:underline font-mono"
            >
              Full Log
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentAudits.map((audit) => (
              <div
                key={audit.id}
                className="p-3.5 rounded-xl bg-[#121824] border border-[#1e293b] flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-medium text-white">{audit.summary}</div>
                  <div className="text-[10px] text-[#64748b] font-mono mt-0.5">
                    by {audit.actorName} · {audit.action}
                  </div>
                </div>

                <div className="text-right shrink-0 text-[10px] text-[#64748b] font-mono">
                  {new Date(audit.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {(!data?.recentAudits || data.recentAudits.length === 0) && (
              <div className="p-6 text-center text-xs text-[#64748b] font-mono border border-dashed border-[#1e293b] rounded-xl">
                No audit entries recorded yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
