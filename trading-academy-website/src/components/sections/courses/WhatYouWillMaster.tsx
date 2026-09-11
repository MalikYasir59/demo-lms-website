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
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0F17] border-b border-white/[0.06]" id="mastery">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <span className="label-telemetry text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-3.5 py-1 rounded-full">
            Learning Outcomes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What You Will Master
          </h2>
          <p className="text-sm text-[#94A3B8]">
            Engineered directly from institutional prop trading floors to build durable, repeatable edge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.tag}
                className="bg-[#121824]/90 backdrop-blur-xl p-6 rounded-lg border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] hover:border-[#6366F1]/40 hover:shadow-[0_0_24px_rgba(99,102,241,0.15)] transition-all flex flex-col gap-4 group"
              >
                <div className="w-12 h-12 rounded bg-[#182234] border border-white/[0.08] flex items-center justify-center text-[#6366F1] group-hover:scale-105 group-hover:text-[#c0c1ff] transition-all shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="label-telemetry text-[#6366F1] uppercase">
                    {p.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight">{p.title}</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed font-normal">
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
