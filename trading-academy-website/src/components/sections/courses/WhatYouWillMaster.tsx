import React from "react";
import { Zap, Target, Shield, Compass } from "lucide-react";

export default function WhatYouWillMaster() {
  const pillars = [
    {
      icon: Target,
      tag: "PILLAR 01",
      title: "Liquidity Pools & Stop Runs",
      description:
        "Understand how institutional market algorithms trap retail breakouts. Identify buy-side and sell-side liquidity sweeps before entering high-confluence swing or intraday trades.",
    },
    {
      icon: Compass,
      tag: "PILLAR 02",
      title: "Market Structure Dynamics",
      description:
        "Differentiate between minor internal pullbacks and genuine Change of Character (CHoCH) structural shifts across multiple timeframes from Monthly to 1-minute execution.",
    },
    {
      icon: Zap,
      tag: "PILLAR 03",
      title: "Supply-Demand & Fair Value Gaps",
      description:
        "Pinpoint algorithmic imbalance zones (FVGs) and mitigation blocks where institutional liquidity has rested. Enter with tight, mathematically defined invalidation levels.",
    },
    {
      icon: Shield,
      tag: "PILLAR 04",
      title: "Prop Evaluation Safeguards",
      description:
        "Master the drawdown formulas used by funded traders. Learn how to allocate risk (0.25% - 0.75%) to survive volatile streaks and pass 50k–200k challenges safely.",
    },
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-brand-surface border-b border-slate-200" id="mastery">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#006c49] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded">
            Learning Outcomes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What You Will Master
          </h2>
          <p className="text-sm text-slate-600">
            Engineered directly from institutional prop trading floors to build durable, repeatable edge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.tag}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-emerald hover:shadow-md transition-all flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-brand-emerald">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase">
                    {p.tag}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

