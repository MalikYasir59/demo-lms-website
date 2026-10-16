"use client";

import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  User,
  ShieldCheck,
} from "lucide-react";
import { AppSidebar, NavSection } from "@/components/shared/AppSidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const navSections: NavSection[] = [
    {
      title: "Learning",
      items: [
        {
          label: "Dashboard",
          href: "/student/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "My Courses",
          href: "/student/courses",
          icon: BookOpen,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          label: "Profile & Settings",
          href: "/student/settings",
          icon: User,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row antialiased selection:bg-primary/20 selection:text-foreground">
      {/* Institutional Left Sidebar */}
      <AppSidebar
        role="student"
        portalTitle="Student Portal"
        portalSubtitle="Trading Tricks LMS"
        homeHref="/student/dashboard"
        navSections={navSections}
        user={{
          name: session?.user?.name,
          email: session?.user?.email,
          studentCode: (session?.user as any)?.studentCode,
          roleBadge: "Student",
          avatar: session?.user?.avatar,
        }}
        onSignOut={() => signOut({ callbackUrl: "/login" })}
        bottomExtra={
          <div className="px-3 py-2 rounded-lg bg-success/10 border border-success/20 flex items-center justify-between text-xs text-success">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Session
            </span>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
