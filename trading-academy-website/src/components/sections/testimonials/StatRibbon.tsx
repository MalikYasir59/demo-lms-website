import React from "react";
import { STUDENT_STATS } from "@/data/testimonials";

export default function StatRibbon() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {STUDENT_STATS.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#121824]/90 backdrop-blur-xl p-6 rounded-lg flex flex-col gap-2 border border-white/[0.08] border-l-4 border-l-[#10B981] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
        >
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono label-telemetry">
            {stat.label}
          </span>
          <span className="text-3xl lg:text-4xl font-extrabold text-white font-mono tabular-nums">
            {stat.value}
          </span>
          <span className="text-xs text-[#94A3B8] font-sans">{stat.subtext}</span>
        </div>
      ))}
    </div>
  );
}
