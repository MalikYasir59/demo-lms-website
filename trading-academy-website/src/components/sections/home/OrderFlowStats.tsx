import React from "react";
import { STUDENT_STATS } from "@/data/testimonials";

export default function OrderFlowStats() {
  return (
    <section className="bg-[#0b1220] border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
            <span className="text-white font-bold">DESK TELEMETRY // REAL-TIME METRICS</span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            AUDITED BY PROPRIETARY RISK SUPERVISORS
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STUDENT_STATS.map((s) => (
            <div
              key={s.label}
              className="border-l-2 border-brand-emerald pl-4 flex flex-col gap-1"
            >
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono">
                {s.label}
              </span>
              <span className="text-3xl font-extrabold text-white font-mono">
                {s.value}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">{s.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

