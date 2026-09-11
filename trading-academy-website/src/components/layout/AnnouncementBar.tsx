"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ANNOUNCEMENT_INFO } from "@/data/nav-links";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside
      id="urgency-bar"
      className="w-full bg-gradient-to-r from-[#06150a] via-[#0d2e18] to-[#081f10] border-b border-emerald-500/30 text-slate-200 fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
      aria-label="Institutional Announcement"
    >
      <div className="max-w-7xl mx-auto h-9 flex items-center justify-between gap-3 text-xs">
        <div className="flex-1 flex items-center justify-center gap-2 text-center overflow-hidden">
          <span className="material-symbols-outlined text-emerald-400 text-sm flex-shrink-0 animate-pulse">
            bolt
          </span>
          <p className="font-medium truncate tracking-wide text-xs">
            <span className="text-emerald-400 font-bold">
              {ANNOUNCEMENT_INFO.statusText}
            </span>
            <span className="text-slate-500 mx-1.5 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">
              {ANNOUNCEMENT_INFO.subtitle}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href={ANNOUNCEMENT_INFO.pricingHref}
            className="hidden md:inline-flex items-center gap-1.5 font-bold text-[11px] bg-[#0d6938] hover:bg-[#09522b] text-white px-2.5 py-0.5 rounded-full border border-emerald-400/40 transition-all shadow-[0_0_10px_rgba(13,105,56,0.4)]"
          >
            Claim Seat — $499
          </Link>
          <button
            aria-label="Dismiss announcement"
            className="text-slate-400 hover:text-white transition-colors p-1"
            onClick={() => setIsVisible(false)}
            type="button"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
