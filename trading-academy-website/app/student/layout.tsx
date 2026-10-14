"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  User,
  LogOut,
  GraduationCap,
  Shield,
} from "lucide-react";
import { ThemeQuickToggle } from "@/components/shared/ThemeQuickToggle";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Keepalive ping every 60 seconds outside video viewer
  useEffect(() => {
    const ping = () => {
      fetch("/api/student/session/ping", { method: "POST" }).catch(() => {});
    };
    ping();
    const interval = setInterval(ping, 60000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      label: "Dashboard",
      href: "/student/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/student/dashboard",
    },
    {
      label: "My Courses",
      href: "/student/courses",
      icon: BookOpen,
      active: pathname.startsWith("/student/courses"),
    },
    {
      label: "Profile",
      href: "/student/settings",
      icon: User,
      active: pathname === "/student/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f1f5f9] flex flex-col antialiased selection:bg-[#6366f1]/30 selection:text-white">
      {/* Top institutional navigation bar */}
      <header className="sticky top-0 z-40 bg-[#0b0f17]/90 backdrop-blur-md border-b border-[#1e293b]/70 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <Link
              href="/student/dashboard"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#10b981] to-[#6366f1] p-0.5 shadow-lg shadow-[#10b981]/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#10b981]" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold tracking-tight text-white text-sm block leading-none">
                  Institute of Trading Tricks
                </span>
                <span className="text-[10px] text-[#64748b] tracking-wider uppercase font-mono mt-0.5 block">
                  Student Portal
                </span>
              </div>
            </Link>

            <span className="px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 text-[10px] font-semibold tracking-wider uppercase">
              Student
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    item.active
                      ? "bg-[#6366f1] text-white shadow-md shadow-[#6366f1]/25"
                      : "text-[#94a3b8] hover:text-white hover:bg-[#121824]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Student Profile Chip & Sign Out */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[#1e293b]">
              <div className="w-8 h-8 rounded-full bg-[#121824] border border-[#1e293b] flex items-center justify-center text-xs font-bold text-[#10b981]">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "S"}
              </div>
              <div className="text-left text-xs leading-none">
                <div className="font-semibold text-white">
                  {session?.user?.name || "Student"}
                </div>
                <div className="text-[10px] font-mono text-[#64748b] mt-1">
                  {session?.user?.studentCode || session?.user?.email}
                </div>
              </div>
            </div>

            <ThemeQuickToggle />

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 rounded-xl text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Shell */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f17]/95 backdrop-blur-lg border-t border-[#1e293b] px-4 py-2 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                item.active ? "text-[#6366f1]" : "text-[#64748b] hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
