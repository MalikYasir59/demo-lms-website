import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function TestimonialsHero() {
  return (
    <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-xs font-mono font-medium shadow-inner">
        <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
        <span className="text-brand-emerald font-bold uppercase tracking-wider text-[11px]">
          STUDENT RESULTS
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
        Real Traders. Verified Results.
      </h1>

      <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
        Real results from retail traders and institutional desks who mastered our quantitative methodologies, algorithmic order flow telemetry, and proprietary market frameworks.
      </p>
    </div>
  );
}

