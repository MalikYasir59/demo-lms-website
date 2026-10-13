import React from "react";
import Link from "next/link";

export default function CourseSubNav() {
  const tabs = [
    { label: "Overview", href: "#overview" },
    { label: "What You'll Master", href: "#mastery" },
    { label: "Full Curriculum", href: "#curriculum" },
    { label: "Instructor", href: "#instructor" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQs", href: "#faq" },
  ];

  return (
    <div className="sticky top-[100px] z-30 w-full bg-[#0B0F17]/95 backdrop-blur-md border-b border-white/[0.06] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-6 sm:gap-8 py-3.5 text-xs font-mono uppercase tracking-wider shrink-0 label-telemetry">
          {tabs.map((tab, idx) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`transition-colors pb-1 ${
                idx === 0
                  ? "text-[#c0c1ff] border-b-2 border-[#6366F1] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs font-mono shrink-0">
          <span className="text-slate-400">
            Enrollment Open: <strong className="text-[#10B981] font-bold">Cohort #14</strong>
          </span>
          <Link
            href="#pricing"
            className="px-3.5 py-1.5 rounded bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white text-xs font-bold border border-white/20 shadow-[0_0_12px_rgba(99,102,241,0.35)] hover:shadow-[0_0_18px_rgba(99,102,241,0.55)] transition-all"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    </div>
  );
}
