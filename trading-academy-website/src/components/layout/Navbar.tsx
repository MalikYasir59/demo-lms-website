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
    <header className="fixed top-7 left-0 right-0 z-40 px-4 sm:px-6">
      <div className="mx-auto max-w-[1500px] rounded-[28px] border border-[#68b7ff]/50 bg-transparent px-4 py-3 shadow-[0_0_20px_rgba(38,96,255,0.16)] backdrop-blur-[1px]">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none flex-shrink-0"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative p-1 rounded-full bg-gradient-to-br from-[#60a5fa] via-[#2563eb] to-[#1e3a8a] shadow-[0_0_18px_rgba(37,99,235,0.35)]">
              <img
                alt="Institute of Trading Tricks Logo"
                className="h-12 w-12 rounded-full object-cover bg-[#080b11]"
                src="/images/Logoitt.jpg"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-tight group-hover:text-[#93c5fd] transition-colors">
                Institute of Trading Tricks
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mt-1">
                Institutional Floor &amp; LMS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1 gap-3 xl:gap-4 px-4">
            {MAIN_NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative inline-flex items-center justify-center whitespace-nowrap px-2 py-2 text-sm xl:text-[0.95rem] font-medium tracking-tight leading-none min-w-fit transition-all duration-200 text-slate-300 hover:text-white",
                    active && "text-white",
                    active && "after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-[2px] after:w-[68%] after:rounded-full after:bg-[#4ea8ff] after:shadow-[0_0_12px_rgba(78,168,255,0.8)]"
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
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#7bb7ff]/60 bg-transparent text-white text-xs font-semibold shadow-[0_0_18px_rgba(13,109,253,0.18)] transition-all group hover:bg-[#0d6dfd]/10"
            >
              <span className="w-2 h-2 rounded-full bg-[#60a5fa] animate-ping" />
              <Terminal className="w-3.5 h-3.5 text-[#93c5fd]" />
              <span>Student LMS</span>
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#0d6dfd] text-white text-xs font-bold shadow-[0_0_20px_rgba(13,109,253,0.38)] border border-[#7bb7ff]/60 transition-all hover:brightness-110"
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
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden mt-3 rounded-2xl border border-white/[0.08] bg-[#080b11]/90 px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <nav className="flex flex-col gap-2">
            {MAIN_NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "relative inline-flex items-center justify-center whitespace-nowrap text-sm py-2.5 font-medium transition-all duration-200 px-2 leading-none min-w-fit text-slate-300 hover:text-white",
                    active && "text-white",
                    active && "after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-[2px] after:w-[60%] after:rounded-full after:bg-[#4ea8ff]"
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
              <Terminal className="w-4 h-4 text-[#93c5fd]" />
              <span>Student LMS Portal</span>
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 text-center text-xs font-bold bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#1d4ed8] text-white py-3 rounded-xl border border-blue-300/40 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
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
