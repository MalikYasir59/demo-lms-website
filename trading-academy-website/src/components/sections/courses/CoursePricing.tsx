import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PricingTier } from "@/types";

interface CoursePricingProps {
  tiers: PricingTier[];
}

export default function CoursePricing({ tiers }: CoursePricingProps) {
  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#080B11] border-b border-white/[0.06] relative" id="pricing">
      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <span className="label-telemetry text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-3.5 py-1 rounded-full">
            Tuition &amp; Access
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transparent Institutional Tiers
          </h2>
          <p className="text-sm text-[#94A3B8]">
            One-time investment with lifetime access. No hidden subscriptions or monthly recurring fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-lg p-8 flex flex-col justify-between transition-all relative ${
                tier.isPopular
                  ? "bg-[#182234] text-white border-2 border-[#6366F1] shadow-[0_20px_48px_-12px_rgba(0,0,0,0.8),0_0_24px_0_rgba(99,102,241,0.25)] scale-[1.02] lg:-translate-y-2 z-10"
                  : "bg-[#121824]/90 backdrop-blur-xl text-white border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] hover:border-white/20"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white font-black px-4 py-1 rounded-full text-[11px] font-mono shadow-[0_0_12px_rgba(99,102,241,0.40)] label-telemetry">
                  {tier.badge}
                </div>
              )}

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-extrabold tracking-tight text-white">
                    {tier.name}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#94A3B8]">
                    {tier.tagline}
                  </p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-white">
                    {tier.price}
                  </span>
                  {tier.originalPrice && (
                    <span className="text-sm text-slate-500 line-through font-mono tabular-nums">
                      {tier.originalPrice}
                    </span>
                  )}
                  {tier.period && (
                    <span className="text-xs font-mono text-slate-400">
                      / {tier.period}
                    </span>
                  )}
                </div>

                <div className="border-t border-white/[0.06] pt-6 flex flex-col gap-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 label-telemetry">
                    Included Benefits:
                  </span>
                  <ul className="flex flex-col gap-2.5">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#10B981]" />
                        <span className="text-[#E2E8F0]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 mt-auto">
                <Link
                  href={tier.ctaHref}
                  className={`w-full py-3.5 rounded font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md label-telemetry ${
                    tier.isPopular
                      ? "bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white border border-white/20 shadow-[0_0_16px_rgba(99,102,241,0.45)] hover:shadow-[0_0_24px_rgba(99,102,241,0.65)] hover:-translate-y-0.5"
                      : "bg-[#182234] hover:bg-[#1f2c42] text-[#E2E8F0] hover:text-white border border-white/[0.08] hover:border-[#6366F1]/40"
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
