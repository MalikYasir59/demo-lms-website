import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PricingTier } from "@/types";

interface CoursePricingProps {
  tiers: PricingTier[];
}

export default function CoursePricing({ tiers }: CoursePricingProps) {
  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-brand-surface border-b border-slate-200" id="pricing">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#006c49] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded">
            Tuition &amp; Access
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparent Institutional Tiers
          </h2>
          <p className="text-sm text-slate-600">
            One-time investment with lifetime access. No hidden subscriptions or monthly recurring fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all relative ${
                tier.isPopular
                  ? "bg-brand-navy-card text-white border-2 border-brand-emerald shadow-2xl scale-[1.02] lg:-translate-y-2"
                  : "bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-emerald text-slate-950 font-black px-4 py-1 rounded-full text-xs font-mono shadow-md">
                  {tier.badge}
                </div>
              )}

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-extrabold tracking-tight">
                    {tier.name}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed ${
                      tier.isPopular ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {tier.tagline}
                  </p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono">
                    {tier.price}
                  </span>
                  {tier.originalPrice && (
                    <span className="text-sm text-slate-400 line-through font-mono">
                      {tier.originalPrice}
                    </span>
                  )}
                  {tier.period && (
                    <span
                      className={`text-xs font-mono ${
                        tier.isPopular ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      / {tier.period}
                    </span>
                  )}
                </div>

                <div
                  className={`border-t pt-6 flex flex-col gap-3 ${
                    tier.isPopular ? "border-slate-800" : "border-slate-100"
                  }`}
                >
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">
                    Included Benefits:
                  </span>
                  <ul className="flex flex-col gap-2.5">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            tier.isPopular ? "text-brand-emerald" : "text-emerald-600"
                          }`}
                        />
                        <span
                          className={tier.isPopular ? "text-slate-300" : "text-slate-700"}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 mt-auto">
                <Link
                  href={tier.ctaHref}
                  className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                    tier.isPopular
                      ? "bg-brand-emerald hover:bg-brand-emerald-hover text-white shadow-emerald-500/25"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
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

