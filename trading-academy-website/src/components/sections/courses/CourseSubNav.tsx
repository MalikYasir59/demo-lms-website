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
    <div className="sticky top-[113px] z-30 w-full bg-[#070b14]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-6 sm:gap-8 py-3.5 text-xs font-mono uppercase tracking-wider shrink-0">
          {tabs.map((tab, idx) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`transition-colors pb-1 ${
                idx === 0
                  ? "text-brand-emerald border-b-2 border-brand-emerald font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs font-mono shrink-0">
          <span className="text-slate-400">
            Enrollment Open: <strong className="text-brand-emerald font-bold">Cohort #14</strong>
          </span>
          <Link
            href="#pricing"
            className="px-3.5 py-1.5 rounded-lg bg-brand-emerald hover:bg-brand-emerald-hover text-white text-xs font-bold transition-colors"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    </div>
  );
}

