"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Terminal, ChevronRight, Phone } from "lucide-react";
import { MAIN_NAV_LINKS } from "@/data/nav-links";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close mobile menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-4 sm:top-7 left-0 right-0 z-50 px-3 sm:px-6">
      <div className="mx-auto max-w-[1500px] rounded-2xl sm:rounded-[28px] border border-[#68b7ff]/50 bg-[#080b11]/85 px-3.5 sm:px-5 py-2.5 sm:py-3 shadow-[0_0_20px_rgba(38,96,255,0.16)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-w-0"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative p-0.5 sm:p-1 rounded-full bg-gradient-to-br from-[#60a5fa] via-[#2563eb] to-[#1e3a8a] shadow-[0_0_18px_rgba(37,99,235,0.35)] shrink-0">
              <img
                alt="Institute of Trading Tricks Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover bg-[#080b11]"
                src="/images/Logoitt.jpg"
              />
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-sm sm:text-base lg:text-lg font-extrabold tracking-tight text-white group-hover:text-[#93c5fd] transition-colors truncate">
                Institute of Trading Tricks
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.16em] sm:tracking-[0.2em] text-slate-400">
                Institutional Floor &amp; LMS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center flex-1 gap-2 xl:gap-4 px-2 xl:px-4">
            {MAIN_NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative inline-flex items-center justify-center whitespace-nowrap px-2.5 py-2 text-sm xl:text-[0.95rem] font-medium tracking-tight leading-none min-w-fit transition-all duration-200 text-slate-300 hover:text-white rounded-lg hover:bg-white/[0.04]",
                    active && "text-white font-semibold",
                    active && "after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-[2px] after:w-[68%] after:rounded-full after:bg-[#4ea8ff] after:shadow-[0_0_12px_rgba(78,168,255,0.8)]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Mobile Burger Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Action Buttons (Hidden on mobile/tablet) */}
            <Link
              href="/#lms-portal"
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#7bb7ff]/60 bg-transparent text-white text-xs font-semibold shadow-[0_0_18px_rgba(13,109,253,0.18)] transition-all group hover:bg-[#0d6dfd]/10"
            >
              <span className="w-2 h-2 rounded-full bg-[#60a5fa] animate-ping" />
              <Terminal className="w-3.5 h-3.5 text-[#93c5fd]" />
              <span>Student LMS</span>
            </Link>
            <Link
              href="/#pricing"
              className="hidden lg:inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#0d6dfd] text-white text-xs font-bold shadow-[0_0_20px_rgba(13,109,253,0.38)] border border-[#7bb7ff]/60 transition-all hover:brightness-110"
            >
              <span>Enroll Now — $499</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile/Tablet Burger Menu Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center p-2 sm:p-2.5 rounded-xl border border-[#68b7ff]/40 bg-[#0d1424] text-slate-200 hover:text-white hover:bg-[#142036] hover:border-[#68b7ff]/70 transition-all lg:hidden shadow-[0_0_15px_rgba(38,96,255,0.15)] focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5 text-[#93c5fd]" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[-1] lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Burger Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden mt-3 max-h-[calc(100vh-100px)] overflow-y-auto rounded-2xl border border-[#68b7ff]/40 bg-[#080b11]/95 px-4 sm:px-6 py-5 flex flex-col gap-5 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(38,96,255,0.2)] backdrop-blur-xl animate-in slide-in-from-top-3 duration-200">
          {/* Header Status Bar inside Drawer */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Trading Desk Navigation
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101b2e] border border-blue-500/30 text-blue-400 font-bold">
              Batch 12 Open
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {MAIN_NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group",
                    active
                      ? "bg-[#10243e] text-white font-semibold border border-[#3b82f6]/40 shadow-[0_0_15px_rgba(37,99,235,0.25)]"
                      : "text-slate-300 hover:text-white hover:bg-[#121929] border border-transparent"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] shrink-0" />}
                    <span>{link.label}</span>
                  </span>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-transform group-hover:translate-x-0.5",
                      active ? "text-[#60a5fa]" : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons in Mobile Menu */}
          <div className="flex flex-col gap-2.5 pt-3 border-t border-white/[0.08]">
            {/* Student LMS Portal */}
            <Link
              href="/#lms-portal"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2.5 text-center text-xs sm:text-sm font-semibold text-white py-3 px-4 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-[#7bb7ff]/50 shadow-[0_0_15px_rgba(13,109,253,0.18)] transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-[#60a5fa] animate-ping" />
              <Terminal className="w-4 h-4 text-[#93c5fd]" />
              <span>Student LMS Portal</span>
            </Link>

            {/* Enroll Now — $499 */}
            <Link
              href="/#pricing"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 text-center text-xs sm:text-sm font-bold bg-[#0d6dfd] hover:bg-[#1b76ff] text-white py-3.5 px-4 rounded-xl border border-[#7bb7ff]/70 shadow-[0_0_25px_rgba(13,109,253,0.45)] transition-all"
            >
              <span>Enroll Now — $499</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
