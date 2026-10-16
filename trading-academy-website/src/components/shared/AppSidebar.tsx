"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  LucideIcon,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
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
    avatar?: string | null;
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

function SidebarAvatarCircle({
  avatar,
  initials,
  sizeClass = "w-8 h-8",
  textClass = "text-xs",
  title,
}: {
  avatar?: string | null;
  initials: string;
  sizeClass?: string;
  textClass?: string;
  title?: string;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [avatar]);

  if (avatar && !imgError) {
    return (
      <div
        className={cn(
          "rounded-full border border-primary/20 overflow-hidden shrink-0 select-none bg-muted shadow-2xs",
          sizeClass
        )}
        title={title}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt={title || "User avatar"}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold shrink-0 select-none",
        sizeClass,
        textClass
      )}
      title={title}
    >
      {initials}
    </div>
  );
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

  // Focus management refs for accessible mobile drawer
  const hamburgerTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Toggle desktop collapsed state and trigger window resize for chart reflow
  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(`itt_sidebar_collapsed_${role}`, String(next));
      } catch {
        // Ignore localStorage write errors
      }
      return next;
    });
  }, [role]);

  // Dispatch window resize event when transition finishes so charts & tables reflow
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("resize"));
      }
    }, 320);
    return () => clearTimeout(timer);
  }, [isCollapsed]);

  // Global Keyboard Shortcut: Ctrl+B or Cmd+B to toggle desktop sidebar
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        toggleCollapsed();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [toggleCollapsed]);

  // Close mobile drawer on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // Mobile drawer: Lock body scroll while open
  useEffect(() => {
    if (mobileOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileOpen]);

  // Mobile drawer: Keyboard accessibility (Escape key and focus trapping)
  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        hamburgerTriggerRef.current?.focus();
        return;
      }

      // Trap Tab key inside drawer
      if (e.key === "Tab" && mobileDrawerRef.current) {
        const focusableElements = mobileDrawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Focus the close button when drawer opens
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
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
          MOBILE & TABLET STICKY TOP HEADER (< lg)
          ==================================================================== */}
      <header className="lg:hidden sticky top-0 z-40 bg-sidebar/95 backdrop-blur-md border-b border-sidebar-border px-4 py-2.5 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2.5">
          <button
            ref={hamburgerTriggerRef}
            onClick={() => setMobileOpen(true)}
            className="min-w-11 min-h-11 flex items-center justify-center -ml-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
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
          <SidebarAvatarCircle
            avatar={user?.avatar}
            initials={initials}
            sizeClass="w-8 h-8"
            title={user?.name || user?.email || "User"}
          />
        </div>
      </header>

      {/* ====================================================================
          MOBILE DRAWER (Backdrop + Slide-over Sheet, < lg)
          ==================================================================== */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => {
              setMobileOpen(false);
              hamburgerTriggerRef.current?.focus();
            }}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <aside
            id="mobile-navigation-drawer"
            ref={mobileDrawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
            className="relative w-72 max-w-[85vw] h-full bg-sidebar border-r border-sidebar-border shadow-2xl flex flex-col justify-between z-10 p-4 overflow-y-auto animate-in slide-in-from-left duration-200"
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-sidebar-border">
                <BrandLogo size="md" variant="full" subtitle={portalTitle} href={homeHref} />
                <button
                  ref={closeButtonRef}
                  onClick={() => {
                    setMobileOpen(false);
                    hamburgerTriggerRef.current?.focus();
                  }}
                  className="min-w-11 min-h-11 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Sections */}
              <nav id="mobile-sidebar-nav" aria-label="Mobile navigation" className="space-y-4">
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
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between min-h-11 px-3.5 py-2 rounded-xl text-sm font-medium transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
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

            {/* Bottom Section (Appearance selector completely removed, clean profile & sign out) */}
            <div className="pt-4 border-t border-sidebar-border space-y-3">
              {bottomExtra}

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-sidebar-accent border border-sidebar-border">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <SidebarAvatarCircle
                    avatar={user?.avatar}
                    initials={initials}
                    sizeClass="w-9 h-9"
                    title={user?.name || user?.email || "User"}
                  />
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
                  className="min-w-10 min-h-10 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-1 shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ====================================================================
          DESKTOP SIDEBAR (Sticky, Expandable/Collapsible Rail, >= lg)
          ==================================================================== */}
      <aside
        id="app-sidebar-nav"
        className={cn(
          "hidden lg:flex flex-col justify-between sticky top-0 h-screen bg-sidebar border-r border-sidebar-border transition-[width] duration-300 ease-in-out z-30 select-none motion-reduce:transition-none",
          isCollapsed ? "w-[70px]" : "w-[260px]"
        )}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header Bar with Logo and Toggle Button */}
          <div
            className={cn(
              "p-3.5 border-b border-sidebar-border flex items-center transition-all duration-300",
              isCollapsed ? "justify-center px-2" : "justify-between"
            )}
          >
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-2">
                <BrandLogo size="md" variant="compact" href={homeHref} />
                <button
                  onClick={toggleCollapsed}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                  title="Expand sidebar (Ctrl+B)"
                  aria-label="Expand sidebar (Ctrl+B)"
                  aria-expanded={false}
                  aria-controls="app-sidebar-nav"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-hidden min-w-0 pr-1">
                  <BrandLogo size="md" variant="full" subtitle={portalTitle} href={homeHref} />
                </div>
                <button
                  onClick={toggleCollapsed}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                  title="Collapse sidebar (Ctrl+B)"
                  aria-label="Collapse sidebar (Ctrl+B)"
                  aria-expanded={true}
                  aria-controls="app-sidebar-nav"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Navigation Links with Smooth Text Fade and Accessible Tooltips */}
          <nav aria-label="Desktop navigation" className="p-3 space-y-4 flex-1 overflow-y-auto overflow-x-hidden">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {!isCollapsed && section.title && (
                  <div className="px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground transition-opacity duration-200">
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
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center rounded-xl text-sm font-medium transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                        isCollapsed
                          ? "justify-center p-2.5"
                          : "justify-between px-3.5 py-2.5",
                        active
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={cn(
                            "w-4 h-4 shrink-0 transition-colors",
                            active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        {!isCollapsed && (
                          <span className="truncate transition-opacity duration-200">
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && item.badge !== undefined && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-foreground font-mono shrink-0">
                          {item.badge}
                        </span>
                      )}

                      {/* Accessible Tooltip for Collapsed Icon Rail */}
                      {isCollapsed && (
                        <span
                          role="tooltip"
                          className="absolute left-full ml-3 px-2.5 py-1.5 bg-popover text-popover-foreground text-xs font-medium rounded-lg shadow-lg border border-border whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center gap-2"
                        >
                          <span>{item.label}</span>
                          {item.badge !== undefined && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-mono">
                              {item.badge}
                            </span>
                          )}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Desktop Sidebar Footer (Appearance selector removed, cleanly laid out) */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          {bottomExtra && !isCollapsed && <div>{bottomExtra}</div>}

          {/* User Profile Card */}
          <div
            className={cn(
              "rounded-xl bg-sidebar-accent border border-sidebar-border transition-all duration-300",
              isCollapsed ? "p-2 flex flex-col items-center gap-2" : "p-2.5 flex items-center justify-between"
            )}
          >
            <div className={cn("flex items-center gap-2.5 overflow-hidden", isCollapsed && "justify-center")}>
              <SidebarAvatarCircle
                avatar={user?.avatar}
                initials={initials}
                sizeClass="w-8 h-8"
                title={user?.name || user?.email || "Account"}
              />
              {!isCollapsed && (
                <div className="overflow-hidden min-w-0 transition-opacity duration-200">
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
                "text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0 flex items-center justify-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
                isCollapsed ? "p-1.5 w-full mt-1" : "p-1.5 ml-2"
              )}
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AppSidebar;
