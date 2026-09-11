import React from "react";
import { TrendingUp, ShieldCheck, BarChart3 } from "lucide-react";

export default function PhilosophyValues() {
  const values = [
    {
      icon: TrendingUp,
      tag: "CORE PRINCIPLE 01",
      title: "Institutional Order Flow",
      description:
        "We trade where institutional market makers accumulate and distribute orders. By stripping away lagging retail indicators, we trade directly from the order book footprint.",
    },
    {
      icon: ShieldCheck,
      tag: "CORE PRINCIPLE 02",
      title: "Execution Discipline & Risk",
      description:
        "Strict mathematical drawdown guardrails and asymmetric risk-to-reward ratios ensure that capital preservation always precedes alpha generation on the desk floor.",
    },
    {
      icon: BarChart3,
      tag: "CORE PRINCIPLE 03",
      title: "Data-Driven Transparency",
      description:
        "Every market thesis is cross-validated against intermarket correlations, algorithmic killzone timing, and proprietary liquidity depth telemetry.",
    },
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#080B11] border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <span className="label-telemetry text-[#c0c1ff] bg-[#6366F1]/15 border border-[#6366F1]/30 px-3.5 py-1 rounded-full">
            Our Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Institutional Standards. Zero Gimmicks.
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Trading is not guesswork. It is a systematic discipline of market microstructure, statistical edge, and risk mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.tag}
                className="bg-[#121824]/90 backdrop-blur-xl border border-white/[0.08] p-8 rounded-lg flex flex-col gap-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] hover:border-[#6366F1]/40 hover:shadow-[0_0_24px_rgba(99,102,241,0.15)] transition-all group"
              >
                <div className="w-12 h-12 rounded bg-[#182234] border border-white/[0.08] flex items-center justify-center text-[#6366F1] group-hover:scale-105 group-hover:text-[#c0c1ff] transition-all shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="label-telemetry text-[#6366F1] uppercase">
                    {v.tag}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight">{v.title}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed font-normal">
                    {v.description}
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
