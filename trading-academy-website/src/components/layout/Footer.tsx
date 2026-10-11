import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#070d15] border-t border-white/[0.08] text-slate-300 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_42%)]" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-10 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_0.9fr_0.9fr] gap-10 lg:gap-16">
          <div className="flex flex-col gap-4 md:pr-4">
            <div className="flex items-center gap-3">
              <div className="relative p-1 rounded-full bg-gradient-to-br from-[#60a5fa] via-[#2563eb] to-[#1e3a8a] shadow-[0_0_20px_rgba(37,99,235,0.35)]">
                <img
                  alt="Institute of Trading Tricks Logo"
                  className="h-12 w-12 rounded-full object-cover bg-[#080b11]"
                  src="/images/Logoitt.jpg"
                />
              </div>
              <span className="text-[1.05rem] sm:text-[1.35rem] font-bold text-white tracking-tight">
                Institute of Trading Tricks
              </span>
            </div>

            <p className="max-w-md text-[1.05rem] leading-relaxed text-slate-400">
              Institutional execution protocol, proprietary Learning Management System, and physical trading floors engineered for autonomous funded traders.
            </p>

            <div className="flex items-center gap-3 text-[0.95rem] text-slate-400 font-mono tracking-wide">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-400/20 text-emerald-400 text-[10px]">
                ✓
              </span>
              <span>3rd Floor Gul Arcade Plaza, PWD Road, Islamabad</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Islamabad Physical Floor Active</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-1">
            <h3 className="text-xs font-mono uppercase tracking-[0.22em] text-white font-bold text-center md:text-left">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2.5 text-sm text-slate-400 text-center md:text-left">
              <Link href="/" className="hover:text-white transition-colors">Home Overview</Link>
              <Link href="/courses" className="hover:text-white transition-colors">Courses &amp; Curriculum</Link>
              <Link href="/#lms-portal" className="hover:text-white transition-colors">Student LMS Portal</Link>
              <Link href="/#campus" className="hover:text-white transition-colors">Campus &amp; Seminars</Link>
              <Link href="/testimonials" className="hover:text-white transition-colors">Client &amp; Testimonials</Link>
              <Link href="/#pricing" className="hover:text-white transition-colors">Batch 12 Enrollment ($499)</Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-1">
            <h3 className="text-xs font-mono uppercase tracking-[0.22em] text-white font-bold text-center md:text-left">
              Compliance &amp; Support
            </h3>
            <div className="flex flex-col gap-2.5 text-sm text-slate-400 text-center md:text-left">
              <Link href="/terms-conditions" className="hover:text-white transition-colors">Risk Disclosure Notice</Link>
              <Link href="/terms-conditions" className="hover:text-white transition-colors">Terms of Participation</Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Protocol</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Direct Desk Contact</Link>
            </div>

            <div className="mt-3 flex items-center gap-3 justify-center md:justify-start">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0f1726]/80 text-[#1877F2] text-xl shadow-[0_0_18px_rgba(24,119,242,0.15)] transition hover:scale-105 hover:border-blue-400/60"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0f1726]/80 text-[#E1306C] text-xl shadow-[0_0_18px_rgba(225,48,108,0.15)] transition hover:scale-105 hover:border-pink-400/60"
                aria-label="Instagram"
              >
                ◌
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0f1726]/80 text-[#FF0000] text-xl shadow-[0_0_18px_rgba(255,0,0,0.15)] transition hover:scale-105 hover:border-red-400/60"
                aria-label="YouTube"
              >
                ▶
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/[0.06] bg-[#0d1420] px-5 py-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400 leading-relaxed">
            Disclaimer: financial trading contains substantial risk of loss and is not suitable for all investors. Institute of Trading Tricks provides financial educational training and software simulator access. Past performance and simulated test results are not necessarily indicative of future results.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-400">
            © 2026 Institute of Trading Tricks. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              LMS Portal Release: <span className="text-emerald-400 font-bold">v4.20-Secure</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
