import React from "react";

export default function ContactHero() {
  return (
    <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121824] border border-white/[0.08] text-slate-300 text-xs font-mono font-medium shadow-inner">
        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
        <span className="text-[#10B981] font-bold uppercase tracking-wider text-[11px] label-telemetry">
          GET IN TOUCH
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400">Direct Institutional Desk</span>
      </div>

      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
        Speak with Our Institutional{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0c1ff] via-[#8083ff] to-[#4edea3]">
          Trading Desk
        </span>
      </h1>

      <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl font-normal">
        Our senior analysts and admissions team are standing by during live market hours to assist with masterclass enrollment, challenge preparation, and enterprise data feeds.
      </p>
    </div>
  );
}
