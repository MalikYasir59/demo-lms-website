import React from "react";

export default function AboutStatsRibbon() {
  const stats = [
    {
      label: "Total Prop Funding",
      value: "$24.5M+",
      sub: "Verified capital passed across top prop firms",
    },
    {
      label: "Challenge Pass Rate",
      value: "89.2%",
      sub: "Institutional risk models Phase 1 & Phase 2",
    },
    {
      label: "Community Traders",
      value: "2,800+",
      sub: "Active institutional network sharing logs",
    },
    {
      label: "Physical Trading Floors",
      value: "London & NY",
      sub: "Live order routing and research facilities",
    },
  ];

  return (
    <section className="bg-[#0B0F17] border-b border-white/[0.06] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
        {stats.map((s) => (
          <div key={s.label} className="border-l-2 border-[#10B981] pl-4 flex flex-col gap-1 bg-[#121824]/40 py-3 pr-4 rounded-r">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono label-telemetry">
              {s.label}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {s.value}
            </span>
            <p className="text-[11px] text-[#94A3B8] font-sans mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
