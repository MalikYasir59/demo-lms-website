"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Terminal } from "lucide-react";
import { MAIN_NAV_LINKS } from "@/data/nav-links";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-9 left-0 right-0 z-40 bg-[#080b11]/85 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none flex-shrink-0"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative p-0.5 rounded-full bg-gradient-to-br from-[#6366f1] via-indigo-600 to-[#10b981]">
            <img
              alt="Institute of Trading Tricks Logo"
              className="h-10 w-10 rounded-full object-cover bg-[#080b11]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmQ-DH0OQoZDOf3sJn2jKkIE6YwIPfGJCV1eGiFaU4rRE3gg9OFNolkCFU2SGCb1AnwsMYE56ibilb185ZSqDm83TojCSrtgjWXD4IS8VO09gs7oCy55ewehIL2W7bsOww8O0DQ2_qyhTV2jcAlOxS0FNjHF7BYvX3349Q8FdZ7gdVkNxMbXKSPjEaA30oUxxc8NMMUbL60-mgQfIGi0I0srHuQ4f1P_AGpXCuA0V48iPMz7ZjJfN8paL2LNRCL-pnKw"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-tight group-hover:text-emerald-400 transition-colors">
              Institute of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                Trading Tricks
              </span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Institutional Floor &amp; LMS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {MAIN_NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-sm transition-colors",
                  active
                    ? "text-emerald-400 font-semibold bg-white/[0.06] border border-emerald-500/25"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/#lms-portal"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/[0.08] bg-[#121722]/80 hover:bg-[#182030] hover:border-emerald-400/40 text-white text-xs font-semibold backdrop-blur-md transition-all group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Student LMS</span>
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#0d6938] hover:bg-[#09522b] text-white text-xs font-bold shadow-[0_0_20px_rgba(13,105,56,0.4)] border border-emerald-400/40 transition-all hover:scale-[1.02]"
          >
            <span>Enroll Now — $499</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#182030] transition-colors lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-[#080b11] border-b border-white/[0.08] px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <nav className="flex flex-col gap-2">
            {MAIN_NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-sm py-2.5 font-medium transition-colors rounded-lg px-3",
                    active
                      ? "text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20"
                      : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-2.5 pt-4 border-t border-white/[0.08]">
            <Link
              href="/#lms-portal"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 text-center text-xs font-semibold text-slate-200 hover:text-white py-3 rounded-xl bg-[#121722] border border-white/[0.08]"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Student LMS Portal</span>
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 text-center text-xs font-bold bg-[#0d6938] hover:bg-[#09522b] text-white py-3 rounded-xl border border-emerald-400/40 shadow-[0_0_20px_rgba(13,105,56,0.4)]"
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
