"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PUBLIC_ASSETS } from "@/data/public-assets";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "COURSES", href: "/courses" },
    { name: "VIDEOS", href: "/videos" },
    { name: "ABOUT", href: "/about-us" },
    { name: "REVIEWS", href: "/reviews" },
    { name: "CONTACT", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/about-us") return pathname === "/about-us" || pathname === "/about";
    if (href === "/reviews") return pathname === "/reviews" || pathname === "/testimonials";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col">
      {/* ===================================================================== */}
      {/* TOP UTILITY BAR                                                       */}
      {/* ===================================================================== */}
      <div className="bg-[#040714] border-b border-white/5 text-[10px] tracking-[0.18em] uppercase text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="truncate">ISLAMABAD · WAH CANTT · ATTOCK</div>
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <span className="hidden sm:inline text-slate-400">OPEN MON–SAT · SUNDAY CLOSED</span>
            <a
              href="tel:+923077330777"
              className="text-[#D4C385] hover:text-[#E5D7A3] font-medium tracking-[0.14em] transition"
            >
              0307 7330777
            </a>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MAIN NAVIGATION HEADER                                                */}
      {/* ===================================================================== */}
      <div className="bg-[#040714]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 text-left group focus:outline-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PUBLIC_ASSETS.logo}
              alt="Institute of Trading Tricks Logo"
              className="w-9 h-9 rounded-full object-cover border border-[#D4C385]/40 shrink-0"
            />
            <div>
              <div className="font-display text-lg sm:text-xl leading-none text-white group-hover:text-[#E5D7A3] transition">
                Institute of Trading Tricks
              </div>
              <div className="text-[8px] tracking-[0.24em] uppercase text-[#D4C385] mt-1">
                EST. ISLAMABAD
              </div>
            </div>
          </Link>

          {/* Center Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[10px] tracking-[0.2em] uppercase">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`nav-link py-1 transition ${
                    active
                      ? "text-[#D4C385] font-semibold"
                      : "text-slate-300 hover:text-[#E5D7A3]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/login"
              className="text-[10px] tracking-[0.2em] uppercase text-slate-300 hover:text-[#D4C385] transition"
            >
              LOGIN
            </Link>
            <Link
              href="/contact"
              className="bg-[#D4C385] hover:bg-[#E5D7A3] text-[#040714] font-semibold text-[10px] tracking-[0.18em] uppercase px-3.5 sm:px-4 py-2.5 transition shadow-sm"
            >
              BOOK A SEAT
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-300 hover:text-white p-1"
              aria-label="Toggle Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#040714] border-t border-white/10 px-4 py-4 space-y-3 text-[11px] tracking-[0.2em] uppercase">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left py-1.5 transition ${
                  isActive(link.href) ? "text-[#D4C385] font-bold" : "text-slate-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-[#D4C385] text-[10px] tracking-[0.2em] uppercase"
              >
                LOGIN (STUDENT LMS)
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#D4C385] text-[#040714] font-semibold text-[10px] tracking-[0.18em] uppercase px-3 py-1.5"
              >
                BOOK A SEAT
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
