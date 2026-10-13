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

            <div className="mt-4 flex items-center gap-4 justify-center md:justify-start">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="transition-transform duration-200 hover:scale-115 focus:outline-none"
                aria-label="Facebook"
              >
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
                    fill="#1877F2"
                  />
                  <path
                    d="M16.67 15.563l.532-3.49h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.514V4.996s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.643H7.078v3.49h3.047V24c.618.097 1.25.147 1.875.147.625 0 1.257-.05 1.875-.147v-8.437h2.796z"
                    fill="#FFFFFF"
                  />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="transition-transform duration-200 hover:scale-115 focus:outline-none"
                aria-label="Instagram"
              >
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="ig-gradient-footer" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f09433" />
                      <stop offset="25%" stopColor="#e6683c" />
                      <stop offset="50%" stopColor="#dc2743" />
                      <stop offset="75%" stopColor="#cc2366" />
                      <stop offset="100%" stopColor="#bc1888" />
                    </linearGradient>
                  </defs>
                  <rect width="24" height="24" rx="6.5" fill="url(#ig-gradient-footer)" />
                  <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="#FFFFFF" strokeWidth="1.75" fill="none" />
                  <circle cx="12" cy="12" r="3.75" stroke="#FFFFFF" strokeWidth="1.75" fill="none" />
                  <circle cx="16.5" cy="7.5" r="1.15" fill="#FFFFFF" />
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="transition-transform duration-200 hover:scale-115 focus:outline-none"
                aria-label="YouTube"
              >
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
                    fill="#FF0000"
                  />
                  <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/[0.06] bg-[#0d1420] px-5 py-4 text-center">
          <p className="text-xs sm:text-sm tracking-normal text-slate-400 leading-relaxed text-left">
            <span className="font-semibold text-slate-300">Disclaimer:</span> Financial trading contains substantial risk of loss and is not suitable for all investors. Institute of Trading Tricks provides financial educational training and software simulator access. Past performance and simulated test results are not necessarily indicative of future results.
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
