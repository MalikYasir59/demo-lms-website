import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function AuditedResultsPayouts() {
  const payouts = [
    {
      firm: "FTMO PROP FIRM",
      amount: "+$14,520.00",
      winRate: "WR: 76.4%",
      payout: "Payout: Confirmed",
      label: "Target Achieved",
      status: "Pass 2-Phase",
    },
    {
      firm: "FUNDEDNEXT",
      amount: "+$24,680.00",
      winRate: "WR: 72.8%",
      payout: "Payout: Confirmed",
      label: "Stellar 1-Step",
      status: "Scale-Up Ready",
    },
    {
      firm: "APEX TRADER FUNDING",
      amount: "+$46,300.00",
      winRate: "WR: 78.1%",
      payout: "Payout: Confirmed",
      label: "NQ / ES Futures",
      status: "Multi-Account",
    },
    {
      firm: "TOPSTEP TRADING",
      amount: "+$21,400.00",
      winRate: "WR: 74.5%",
      payout: "Payout: Confirmed",
      label: "Express Funded",
      status: "Daily Lock",
    },
  ];

  return (
    <section
      className="w-full bg-[#080B11] py-20 border-t border-white/[0.08] relative overflow-hidden"
      id="payouts"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#0d6938]/25 via-emerald-500/15 to-[#0d6938]/25 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
              VERIFIED AUDIT STATEMENTS
            </span>
            <h2 className="mt-2.5 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Audited Results &amp; Prop Payouts
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs text-emerald-400 uppercase font-bold tracking-wider">
              Third-Party Desk Certified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {payouts.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-[#121722] p-5 border border-white/[0.08] hover:border-emerald-400/40 shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {item.firm}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-4">
                <span className="font-mono text-3xl text-emerald-400 font-black tracking-tight drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  {item.amount}
                </span>
                <div className="mt-2 flex items-center justify-between font-mono text-xs text-slate-400">
                  <span>{item.winRate}</span>
                  <span className="text-emerald-400 font-semibold">{item.payout}</span>
                </div>
              </div>
              <div className="mt-4 pt-2.5 bg-[#0c1018] rounded-lg px-3 py-2 flex items-center justify-between font-mono text-[11px] text-slate-400 border border-white/[0.04]">
                <span>{item.label}</span>
                <span className="text-emerald-400 font-bold">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

