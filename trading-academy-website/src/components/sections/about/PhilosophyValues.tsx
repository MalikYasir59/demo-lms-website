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
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-brand-surface border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#1E40AF] bg-[#E0E7FF] border border-[#1E40AF]/20 px-3 py-1 rounded">
            Our Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Institutional Standards. Zero Gimmicks.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Trading is not guesswork. It is a systematic discipline of market microstructure, statistical edge, and risk mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.tag}
                className="bg-white border border-slate-200 p-8 rounded-2xl flex flex-col gap-5 shadow-sm hover:border-brand-emerald hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-brand-emerald group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase tracking-wider">
                    {v.tag}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">{v.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
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

