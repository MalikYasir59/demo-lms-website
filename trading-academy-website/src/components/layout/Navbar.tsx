"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, Menu, X, ArrowRight } from "lucide-react";
import { MAIN_NAV_LINKS } from "@/data/nav-links";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === "/trading-desk";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-[33px] w-full z-40 bg-[#0B1220]/95 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none"
          onClick={() => setIsOpen(false)}
        >
          <div className="w-10 h-10 rounded-lg bg-brand-royal text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:bg-blue-600 transition-all">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-sm tracking-tight leading-none group-hover:text-blue-400 transition-colors">
              INSTITUTE OF
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-semibold mt-0.5">
              Trading Tricks
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {MAIN_NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors",
                  active
                    ? "text-emerald-400 font-bold border-b-2 border-emerald-400 pb-0.5"
                    : "text-slate-300 hover:text-emerald-400"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/contact?subject=student-portal"
            className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-lg border border-slate-700 hover:border-slate-500 transition-all"
          >
            Student Portal
          </Link>
          <Link
            href="/courses/price-action-mastery#pricing"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-brand-emerald hover:bg-brand-emerald-hover text-white transition-all shadow-sm shadow-emerald-500/25"
          >
            <span>Enroll Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-[#070B14] border-b border-slate-800 px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-3">
            {MAIN_NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-base py-2 font-medium transition-colors border-l-2 pl-3",
                    active
                      ? "text-emerald-400 font-bold border-emerald-400 bg-emerald-950/20"
                      : "text-slate-300 border-transparent hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-800">
            <Link
              href="/contact?subject=student-portal"
              onClick={() => setIsOpen(false)}
              className="text-center text-xs font-semibold text-slate-300 hover:text-white py-3 rounded-lg border border-slate-700 bg-slate-900/60"
            >
              Student Portal
            </Link>
            <Link
              href="/courses/price-action-mastery#pricing"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 text-center text-sm font-bold bg-brand-emerald hover:bg-brand-emerald-hover text-white py-3 rounded-lg shadow-md shadow-emerald-500/25"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

