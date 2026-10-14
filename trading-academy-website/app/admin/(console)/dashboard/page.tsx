import React from "react";
import Link from "next/link";
import { Users, BookOpen, ShieldCheck, Activity, ArrowUpRight } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#121824] via-[#0b0f17] to-[#121824] border border-[#1e293b] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#6366f1]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/15 text-[#6366f1] border border-[#6366f1]/30 text-xs font-mono mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse" />
            <span>Master Console Online</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Institute of Trading Tricks LMS
          </h1>
          <p className="text-sm text-[#94a3b8] mt-2 leading-relaxed">
            Role-based institutional academy control terminal. Manage student accounts, course modules, secure streaming watermarks, and forensic analytics.
          </p>

          <div className="flex items-center gap-3 mt-6">
            <Link
              href="/admin/students"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white text-xs font-semibold hover:opacity-95 transition-opacity shadow-lg shadow-[#6366f1]/25 flex items-center gap-1.5"
            >
              <span>Manage Students</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/students"
          className="p-5 rounded-2xl bg-[#0b0f17] border border-[#1e293b] hover:border-[#6366f1]/50 transition-colors group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-[#64748b] uppercase tracking-wider">
              Student Directory
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#121824] text-[#6366f1] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-white">Active Management</div>
          <div className="text-xs text-[#10b981] mt-1 flex items-center gap-1">
            <span>CRUD, Credentials, Sessions</span>
          </div>
        </Link>

        <div className="p-5 rounded-2xl bg-[#0b0f17] border border-[#1e293b]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-[#64748b] uppercase tracking-wider">
              Courses Matrix
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#121824] text-[#10b981] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-white">Curriculum Engine</div>
          <div className="text-xs text-[#94a3b8] mt-1">Scheduled for Phase P3</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b0f17] border border-[#1e293b]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-[#64748b] uppercase tracking-wider">
              Single-Device Shield
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#121824] text-[#f59e0b] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-white">Active Enforced</div>
          <div className="text-xs text-[#10b981] mt-1">Multi-device lockouts enabled</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b0f17] border border-[#1e293b]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-[#64748b] uppercase tracking-wider">
              Telemetry Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#121824] text-[#6366f1] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-white">Atlas M0 Active</div>
          <div className="text-xs text-[#94a3b8] mt-1">Hostinger Node.js ready</div>
        </div>
      </div>
    </div>
  );
}
