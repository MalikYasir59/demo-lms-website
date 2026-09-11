import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonials";

export default function TestimonialsRibbon() {
  const previewList = TESTIMONIALS.slice(0, 3);

  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0F17] border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="label-telemetry text-[#c0c1ff] bg-[#6366F1]/15 border border-[#6366F1]/30 px-3 py-1 rounded-full w-max">
              Social Proof
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Verified Funded Student Outcomes
            </h2>
            <p className="text-[#94A3B8] text-sm">
              Real results from everyday retail traders who adopted institutional order flow.
            </p>
          </div>

          <Link
            href="/testimonials"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#10B981] hover:text-[#4edea3] transition-colors font-mono label-telemetry"
          >
            <span>View all reviews &amp; payouts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewList.map((t) => (
            <div
              key={t.id}
              className="bg-[#121824]/90 backdrop-blur-xl p-6 rounded-lg border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] hover:border-[#6366F1]/35 hover:shadow-[0_0_24px_rgba(99,102,241,0.15)] transition-all flex flex-col justify-between gap-6 group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-[#F59E0B]" />
                    ))}
                  </div>
                  {t.highlightProfit && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 text-[11px] font-mono font-bold tabular-nums">
                      {t.highlightProfit}
                    </span>
                  )}
                </div>

                <p className="text-[#E2E8F0] text-sm leading-relaxed font-normal">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/[0.12] relative shrink-0">
                    <Image
                      src={t.avatarUrl}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <span className="text-xs text-[#10B981] font-semibold font-mono">
                      {t.role}
                    </span>
                  </div>
                </div>

                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
