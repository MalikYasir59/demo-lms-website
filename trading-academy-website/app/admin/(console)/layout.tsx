"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  ExternalLink,
  Clock,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminConsoleLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080b11] text-[#e0e2eb] flex flex-col md:flex-row relative selection:bg-[#6366f1] selection:text-white">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0b0f17] border-b border-[#1e293b] sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#121824] border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] font-bold text-xs">
            ITT
          </div>
          <span className="font-bold text-sm tracking-tight text-white">Admin Console</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#94a3b8] hover:text-white hover:bg-[#121824] rounded-lg transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0b0f17] border-r border-[#1e293b] flex flex-col justify-between z-40 transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo & Console Title */}
          <div className="p-5 border-b border-[#1e293b]/70 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#121824] border border-[#6366f1]/40 flex items-center justify-center text-[#6366f1] shadow-lg shadow-[#6366f1]/15 group-hover:border-[#6366f1] transition-all">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white tracking-wide">ITT Console</div>
                <div className="text-[10px] font-mono text-[#f59e0b] uppercase tracking-wider">
                  Master Authority
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25 font-semibold"
                      : "text-[#94a3b8] hover:text-white hover:bg-[#121824]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#64748b]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[#1e293b]/70 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#121824]/60 text-xs text-[#94a3b8] hover:text-white hover:bg-[#121824] transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="p-2.5 rounded-xl bg-[#121824] border border-[#1e293b] flex items-center justify-between">
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">
                {session?.user?.name || "Administrator"}
              </div>
              <div className="text-[10px] font-mono text-[#64748b] truncate">
                {session?.user?.email || "admin@tradingtricks.institute"}
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              title="Sign Out"
              className="p-1.5 text-[#94a3b8] hover:text-red-400 hover:bg-[#1e293b] rounded-lg transition-colors ml-2 shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Desktop Topbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#0b0f17]/60 backdrop-blur-md border-b border-[#1e293b] sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#64748b] uppercase tracking-wider">
              Terminal
            </span>
            <span className="text-[#334155]">&bull;</span>
            <span className="text-xs text-[#94a3b8]">Institutional Learning Management</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#94a3b8]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span>TLS / Secure Session</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#64748b]">
              <Clock className="w-3.5 h-3.5" />
              <span>PKT (UTC+5)</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </div>
  );
}
