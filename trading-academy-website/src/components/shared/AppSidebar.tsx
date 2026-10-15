"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface AppSidebarProps {
  role: "admin" | "student";
  portalTitle: string;
  portalSubtitle?: string;
  homeHref: string;
  navSections: NavSection[];
  user?: {
    name?: string | null;
    email?: string | null;
    studentCode?: string | null;
    roleBadge?: string;
  };
  onSignOut: () => void;
  bottomExtra?: React.ReactNode;
}

function getStoredCollapsed(role: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(`itt_sidebar_collapsed_${role}`) === "true";
  } catch {
    return false;
  }
}

export function AppSidebar({
  role,
  portalTitle,
  portalSubtitle,
  homeHref,
  navSections,
  user,
  onSignOut,
  bottomExtra,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(() => getStoredCollapsed(role));
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(`itt_sidebar_collapsed_${role}`, String(next));
      } catch {
        // Ignore localStorage write errors
      }
      return next;
    });
  };

  // Close mobile drawer on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // User initials
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : role === "admin"
    ? "AD"
    : "ST";

  const isItemActive = (href: string) => {
    if (href === homeHref) return pathname === homeHref;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* ====================================================================
          MOBILE & TABLET STICKY TOP HEADER (< md)
          ==================================================================== */}
      <header className="md:hidden sticky top-0 z-40 bg-sidebar/95 backdrop-blur-md border-b border-sidebar-border px-4 py-2.5 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(true)}
            className="min-w-11 min-h-11 flex items-center justify-center -ml-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
          <BrandLogo size="sm" variant="compact" href={homeHref} />
          <div className="flex flex-col">
            <span className="font-bold text-xs leading-tight text-foreground truncate">
              {portalTitle}
            </span>
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
              {portalSubtitle || "Institute of Trading Tricks"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle variant="inline" />
          <div
            className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs select-none"
            title={user?.name || user?.email || "User"}
          >
            {initials}
          </div>
        </div>
      </header>

      {/* ====================================================================
          MOBILE DRAWER (Backdrop + Slide-over Sheet)
          ==================================================================== */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
            className="relative w-72 max-w-[85vw] h-full bg-sidebar border-r border-sidebar-border shadow-2xl flex flex-col justify-between z-10 p-4 overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-sidebar-border">
                <BrandLogo size="md" variant="full" subtitle={portalTitle} href={homeHref} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="min-w-11 min-h-11 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Sections */}
              <nav className="space-y-4">
                {navSections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    {section.title && (
                      <div className="px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                        {section.title}
                      </div>
                    )}
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isItemActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center justify-between min-h-11 px-3.5 py-2 rounded-xl text-sm font-medium transition-all",
                            active
                              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={cn("w-5 h-5", active ? "text-primary-foreground" : "text-muted-foreground")} />
                            <span>{item.label}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-foreground font-mono">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>

            {/* Bottom Section */}
            <div className="pt-4 border-t border-sidebar-border space-y-3">
              {bottomExtra}

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-sidebar-accent border border-sidebar-border">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {initials}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-foreground truncate">
                      {user?.name || (role === "admin" ? "Administrator" : "Student")}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground truncate">
                      {user?.studentCode || user?.email || (role === "admin" ? "admin@itt.edu" : "student")}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  title="Sign out"
                  className="min-w-10 min-h-10 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-1 shrink-0"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between px-1 pt-1">
                <span className="text-xs text-muted-foreground font-medium">Appearance</span>
                <ThemeToggle variant="inline" />
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ====================================================================
          DESKTOP SIDEBAR (sticky, expandable/collapsible)
          ==================================================================== */}
      <aside
        className={cn(
          "hidden md:flex flex-col justify-between sticky top-0 h-screen bg-sidebar border-r border-sidebar-border transition-[width] duration-200 z-30 select-none",
          isCollapsed ? "w-18" : "w-64"
        )}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo / Brand Header */}
          <div
            className={cn(
              "p-4 border-b border-sidebar-border flex items-center transition-all",
              isCollapsed ? "justify-center px-2" : "justify-between"
            )}
          >
            {isCollapsed ? (
              <BrandLogo size="md" variant="compact" href={homeHref} />
            ) : (
              <div className="overflow-hidden">
                <BrandLogo size="md" variant="full" subtitle={portalTitle} href={homeHref} />
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-4 flex-1 overflow-y-auto">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {!isCollapsed && section.title && (
                  <div className="px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </div>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={isCollapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex items-center rounded-xl text-sm font-medium transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                        isCollapsed
                          ? "justify-center p-2.5"
                          : "justify-between px-3.5 py-2.5",
                        active
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            "w-4 h-4 shrink-0 transition-colors",
                            active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isCollapsed && item.badge !== undefined && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-foreground font-mono">
                          {item.badge}
                        </span>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <span className="absolute left-full ml-3 px-2.5 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md border border-border whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Desktop Sidebar Footer */}
        <div className="p-3 border-t border-sidebar-border space-y-2.5">
          {bottomExtra && !isCollapsed && <div>{bottomExtra}</div>}

          {/* User Card */}
          <div
            className={cn(
              "rounded-xl bg-sidebar-accent border border-sidebar-border transition-all",
              isCollapsed ? "p-2 flex flex-col items-center gap-2" : "p-2.5 flex items-center justify-between"
            )}
          >
            <div className={cn("flex items-center gap-2.5 overflow-hidden", isCollapsed && "justify-center")}>
              <div
                className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 select-none"
                title={user?.name || user?.email || "Account"}
              >
                {initials}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">
                    {user?.name || (role === "admin" ? "Administrator" : "Student")}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground truncate">
                    {user?.studentCode || user?.email || (role === "admin" ? "admin@itt.edu" : "student")}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onSignOut}
              title="Sign out"
              className={cn(
                "text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0 flex items-center justify-center",
                isCollapsed ? "p-1.5 w-full mt-1" : "p-1.5 ml-2"
              )}
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Toggle & Collapse Trigger Bar */}
          <div
            className={cn(
              "flex items-center pt-1 transition-all",
              isCollapsed ? "flex-col gap-2 justify-center" : "justify-between px-1"
            )}
          >
            <ThemeToggle variant="inline" />

            <button
              onClick={toggleCollapsed}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
