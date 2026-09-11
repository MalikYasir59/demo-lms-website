import React from "react";
import { STUDENT_STATS } from "@/data/testimonials";

export default function OrderFlowStats() {
  return (
    <section className="bg-[#0B0F17] border-b border-white/[0.06] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-white font-bold label-telemetry">DESK TELEMETRY // REAL-TIME METRICS</span>
          </div>
          <div className="text-xs font-mono text-slate-400 label-telemetry">
            AUDITED BY PROPRIETARY RISK SUPERVISORS
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STUDENT_STATS.map((s) => (
            <div
              key={s.label}
              className="border-l-2 border-[#10B981] pl-4 flex flex-col gap-1 bg-[#121824]/40 py-3 pr-4 rounded-r"
            >
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono label-telemetry">
                {s.label}
              </span>
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                {s.value}
              </span>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">{s.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
