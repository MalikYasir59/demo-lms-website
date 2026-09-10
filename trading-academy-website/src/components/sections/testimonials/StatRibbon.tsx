import React from "react";
import { STUDENT_STATS } from "@/data/testimonials";

export default function StatRibbon() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {STUDENT_STATS.map((stat) => (
        <div
          key={stat.label}
          className="bg-brand-navy-card p-6 rounded-xl flex flex-col gap-2 border border-slate-800/80 border-l-4 border-l-brand-emerald shadow-xl"
        >
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono">
            {stat.label}
          </span>
          <span className="text-3xl lg:text-4xl font-extrabold text-white font-mono">
            {stat.value}
          </span>
          <span className="text-xs text-slate-500 font-sans">{stat.subtext}</span>
        </div>
      ))}
    </div>
  );
}

