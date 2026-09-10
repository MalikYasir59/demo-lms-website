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
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#006c49] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded">
            The Institutional Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Traders Switch to Trading Tricks
          </h2>
          <p className="text-sm text-slate-600">
            Retail technical analysis leaves you vulnerable to algorithmic stop hunts. We teach you to trade alongside the hunt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.tag}
                className="bg-[#faf8ff] p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-emerald hover:shadow-md transition-all flex flex-col gap-5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-brand-emerald group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase">
                    {f.tag}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
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

