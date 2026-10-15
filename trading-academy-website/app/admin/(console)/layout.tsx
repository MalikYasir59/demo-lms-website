"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  ExternalLink,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { AppSidebar, NavSection } from "@/components/shared/AppSidebar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Students", href: "/admin/students", icon: Users },
      { label: "Courses", href: "/admin/courses", icon: BookOpen },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminConsoleLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative selection:bg-primary/25 selection:text-foreground">
      {/* Reusable AppSidebar for Admin */}
      <AppSidebar
        role="admin"
        portalTitle="Admin Console"
        portalSubtitle="Institute of Trading Tricks"
        homeHref="/admin/dashboard"
        navSections={NAV_SECTIONS}
        user={{
          name: session?.user?.name || "Administrator",
          email: session?.user?.email || "admin@itt.edu",
          roleBadge: "Master Authority",
        }}
        onSignOut={() => signOut({ callbackUrl: "/admin/login" })}
        bottomExtra={
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted text-xs text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Desktop Topbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">
              Admin Terminal
            </span>
            <span className="text-border">&bull;</span>
            <span className="text-xs text-muted-foreground">
              Institute of Trading Tricks LMS
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TLS / Secure Session</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>PKT (UTC+5)</span>
            </div>
            <ThemeToggle variant="dropdown" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
