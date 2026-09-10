import React from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { ANNOUNCEMENT_INFO } from "@/data/nav-links";

export default function AnnouncementBar() {
  return (
    <aside
      className="bg-[#070B14] text-slate-300 text-xs border-b border-slate-800/80 py-2 px-4 sm:px-6 lg:px-12 fixed top-0 w-full z-50 transition-all"
      aria-label="Institutional Announcement"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] sm:text-xs">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <span className="flex items-center gap-2 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {ANNOUNCEMENT_INFO.statusText}
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline font-mono">
            {ANNOUNCEMENT_INFO.hours}
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <a
            href={ANNOUNCEMENT_INFO.phoneTel}
            className="hover:text-emerald-400 transition-colors hidden md:inline-flex items-center gap-1.5 font-mono text-slate-300"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            {ANNOUNCEMENT_INFO.phone}
          </a>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4 font-mono text-[11px]">
          <span className="hidden lg:inline text-slate-400">
            Institutional Feed:{" "}
            <span className="text-emerald-400 font-bold">{ANNOUNCEMENT_INFO.feedStatus}</span>
          </span>
          <div className="flex items-center space-x-2 sm:pl-3 sm:border-l sm:border-slate-800">
            <Link
              href={ANNOUNCEMENT_INFO.terminalPortalHref}
              className="hover:text-emerald-400 transition-colors text-slate-400"
            >
              Terminal Portal
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              href={ANNOUNCEMENT_INFO.riskDisclosureHref}
              className="hover:text-emerald-400 transition-colors text-slate-400"
            >
              Risk Disclosure
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

