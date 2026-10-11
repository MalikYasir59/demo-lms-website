import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Lock } from "lucide-react";

export default function LmsEnrollmentPricing() {
  const features = [
    "Full Lifetime Access to Student LMS Portal & Video Vault",
    "6-Module Institutional Video Curriculum (35+ Hours in 4K)",
    "Daily London & NY Live Trading Desks & Archived Replays",
    "Physical Campus & Trading Floor Pass (Islamabad Floor)",
    "Risk Calculators, Position Size Matrix & Notion Trade Journal",
    "14-Day Action Guarantee",
  ];

  return (
    <section
      className="w-full bg-[#0c1018] py-20 lg:py-28 relative overflow-hidden border-t border-white/[0.08]"
      id="pricing"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-indigo-500/20 via-indigo-600/15 to-emerald-500/15 blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-indigo-500 via-indigo-600 to-emerald-400 shadow-[0_0_60px_rgba(99,102,241,0.25)]">
          <div className="rounded-[23px] bg-[#121722] p-6 sm:p-10 relative overflow-hidden">
            {/* Pill */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#080B11] border border-blue-400/50 text-blue-300 font-mono text-xs uppercase tracking-wider font-bold shadow-xl">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                <span>BATCH 12 NOW OPEN — INSTANT LMS ACTIVATION</span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Institute of Trading Tricks — Complete Mentorship
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Everything required to pass funded evaluations and trade with institutional order flow.
              </p>

              <div className="mt-6 flex items-center justify-center gap-4">
                <span className="font-mono text-5xl sm:text-6xl text-white font-black tracking-tight">
                  $499
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-mono text-sm text-slate-500 line-through">
                    $999 Regular
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase">
                    50% DISCOUNT
                  </span>
                </div>
              </div>

              <span className="font-mono text-xs text-emerald-400 uppercase mt-2 block font-semibold tracking-wider">
                $499 One-Time Access • Lifetime Validity &amp; Portal Updates
              </span>
            </div>

            {/* Benefits List */}
            <div className="mt-8 bg-[#0c1018]/90 p-5 sm:p-6 rounded-2xl border border-white/[0.08]">
              <ul className="flex flex-col gap-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-200 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Link
                href="/contact?tier=batch12"
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563eb] text-white text-sm font-bold shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-blue-300/40 hover:scale-[1.01] transition-all"
              >
                <span>Secure Spot &amp; Get Instant LMS Access — $499</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="mt-3 text-center text-slate-400 font-mono text-xs">
              Instant login credentials sent to your email immediately upon enrollment.
            </p>

            <div className="mt-2 flex items-center justify-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-wide">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Encrypted Checkout • Stripe &amp; Card Secure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

