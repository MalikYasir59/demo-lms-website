import React from "react";
import { Cpu, ShieldCheck, Activity } from "lucide-react";

export default function TerminalFeatures() {
  const features = [
    {
      icon: Cpu,
      tag: "FEATURE 01",
      title: "Zero Lagging Retail Indicators",
      description:
        "Strip away moving averages, RSI, and MACD. Learn to read raw order flow imbalance, resting liquidity pools, and stop runs directly from institutional market maker mechanics.",
    },
    {
      icon: ShieldCheck,
      tag: "FEATURE 02",
      title: "Prop Firm Challenge Engineered",
      description:
        "Our mathematical position-sizing formulas and risk models are purpose-built to pass 50K, 100K, and 200K evaluations without risking maximum trailing or daily drawdown violations.",
    },
    {
      icon: Activity,
      tag: "FEATURE 03",
      title: "Live London & NY Floor Sync",
      description:
        "Trade synchronized with active institutional desks. Get daily pre-market killzone plans, weekly macro thesis briefs, and direct access to senior desk analysts.",
    },
  ];

  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#080B11] border-b border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <span className="label-telemetry text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-3.5 py-1 rounded-full">
            The Institutional Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Traders Switch to Trading Tricks
          </h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Retail technical analysis leaves you vulnerable to algorithmic stop hunts. We teach you to trade alongside the hunt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.tag}
                className="bg-[#121824]/90 backdrop-blur-xl p-8 rounded-lg border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] hover:border-[#6366F1]/40 hover:shadow-[0_0_24px_rgba(99,102,241,0.15)] transition-all flex flex-col gap-5 group"
              >
                <div className="w-12 h-12 rounded bg-[#182234] border border-white/[0.08] flex items-center justify-center text-[#6366F1] group-hover:scale-105 group-hover:text-[#c0c1ff] group-hover:border-[#6366F1]/40 transition-all shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="label-telemetry text-[#6366F1] uppercase">
                    {f.tag}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight">{f.title}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed font-normal">
                    {f.description}
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
