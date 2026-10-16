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
} from "lucide-react";
import { MetricCard } from "@/components/analytics/MetricCard";
import { AreaTrendChart } from "@/components/analytics/AreaTrendChart";
import { Button } from "@/components/ui/Button";

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
      <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-r from-card via-muted/30 to-card border border-border shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/25 text-xs font-mono mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Institutional Academy Online</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Institute of Trading Tricks LMS
            </h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Institutional administrative command centre. Supervise student cohorts, video streaming telemetries, content drip sequences, and forensic security alerts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/students">
              <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </Button>
            </Link>
            <Link href="/admin/courses">
              <Button variant="secondary" size="sm" className="gap-1.5 shadow-xs">
                <BookOpen className="w-4 h-4 text-success" />
                <span>Courses Matrix</span>
              </Button>
            </Link>
            <button
              onClick={fetchDashboard}
              className="p-2 rounded-xl bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors cursor-pointer"
              title="Refresh Telemetry"
              aria-label="Refresh Telemetry"
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
          iconColor="text-primary"
        />
        <MetricCard
          title="Published Courses"
          value={data?.kpis.publishedCourses ?? "—"}
          subtitle="Academy curriculum modules"
          icon={BookOpen}
          iconColor="text-success"
        />
        <MetricCard
          title="Active Enrollments"
          value={data?.kpis.activeEnrollments ?? "—"}
          subtitle="Effective student licenses"
          icon={GraduationCap}
          iconColor="text-info"
        />
        <MetricCard
          title="Watch Hours (30d)"
          value={data ? `${data.kpis.watchHours30d}h` : "—"}
          subtitle="Telemetry verified time"
          icon={Clock}
          iconColor="text-primary"
        />
        <MetricCard
          title="Avg Completion"
          value={data ? `${data.kpis.avgCompletionRate}%` : "—"}
          subtitle="Enrolled completion rate"
          icon={CheckCircle2}
          iconColor="text-success"
        />
        <MetricCard
          title="Expiring (7 Days)"
          value={data?.kpis.expiringIn7Days ?? "—"}
          subtitle="Enrollments ending soon"
          icon={AlertTriangle}
          iconColor="text-warning"
        />
        <MetricCard
          title="Security Alerts"
          value={data?.kpis.openSecurityAlerts ?? "—"}
          subtitle="Unresolved strike flags"
          icon={ShieldAlert}
          iconColor="text-destructive"
        />
        <Link
          href="/admin/analytics"
          className="p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group flex flex-col justify-between shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Analytics Engine
            </span>
            <div className="w-9 h-9 rounded-xl bg-muted text-primary flex items-center justify-center border border-border group-hover:scale-105 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">Full Intelligence</div>
            <div className="text-xs text-primary mt-1 flex items-center gap-1">
              <span>View Leaderboards & Funnels &rarr;</span>
            </div>
          </div>
        </Link>
      </div>

      {/* 14-Day Activity Trends Area Chart */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Academy Watch Time (Last 14 Days)</h3>
            <p className="text-xs text-muted-foreground">Daily cumulative hours streamed by students</p>
          </div>
          <span className="text-xs font-mono text-success bg-success/10 px-2.5 py-1 rounded-lg border border-success/20">
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
            color="hsl(var(--primary))"
            height={220}
          />
        )}
      </div>

      {/* Two Columns: Expiring Enrollments & Recent Audit Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Enrollments */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Upcoming Expiring Enrollments</h3>
              <p className="text-xs text-muted-foreground">Licenses expiring in the next 7 days</p>
            </div>
            <Link
              href="/admin/students"
              className="text-xs text-primary hover:underline font-mono font-medium"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {data?.expiringEnrollments.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
              >
                <div className="truncate">
                  <div className="text-xs font-semibold text-foreground truncate">
                    {item.studentName}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {item.courseTitle}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] font-mono text-warning font-medium">
                    {new Date(item.expiresAt).toLocaleDateString()}
                  </div>
                  <Link
                    href={`/admin/students`}
                    className="text-[10px] text-primary hover:underline font-mono"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
            {(!data?.expiringEnrollments || data.expiringEnrollments.length === 0) && (
              <div className="p-6 text-center text-xs text-muted-foreground font-mono border border-dashed border-border rounded-xl">
                No enrollments expiring within the next 7 days
              </div>
            )}
          </div>
        </div>

        {/* Recent Audit Feed */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Recent System Audit Log</h3>
              <p className="text-xs text-muted-foreground">Administrative actions and credentials</p>
            </div>
            <Link
              href="/admin/settings"
              className="text-xs text-primary hover:underline font-mono font-medium"
            >
              Full Log
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentAudits.map((audit) => (
              <div
                key={audit.id}
                className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-medium text-foreground">{audit.summary}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    by {audit.actorName} · {audit.action}
                  </div>
                </div>

                <div className="text-right shrink-0 text-[10px] text-muted-foreground font-mono">
                  {new Date(audit.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {(!data?.recentAudits || data.recentAudits.length === 0) && (
              <div className="p-6 text-center text-xs text-muted-foreground font-mono border border-dashed border-border rounded-xl">
                No audit entries recorded yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
