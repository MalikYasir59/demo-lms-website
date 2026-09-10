import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonials";

export default function TestimonialsRibbon() {
  const previewList = TESTIMONIALS.slice(0, 3);

  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#1E40AF] bg-[#E0E7FF] border border-[#1E40AF]/20 px-3 py-1 rounded w-max">
              Social Proof
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Verified Funded Student Outcomes
            </h2>
            <p className="text-slate-600 text-sm">
              Real results from everyday retail traders who adopted institutional order flow.
            </p>
          </div>

          <Link
            href="/testimonials"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-emerald hover:text-brand-emerald-hover transition-colors font-mono"
          >
            <span>View all reviews &amp; payouts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewList.map((t) => (
            <div
              key={t.id}
              className="bg-brand-surface p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-emerald hover:shadow-md transition-all flex flex-col justify-between gap-6"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-amber-400" />
                    ))}
                  </div>
                  {t.highlightProfit && (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                      {t.highlightProfit}
                    </span>
                  )}
                </div>

                <p className="text-slate-700 text-sm leading-relaxed font-normal">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-300 relative shrink-0">
                    <Image
                      src={t.avatarUrl}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    <span className="text-xs text-emerald-600 font-semibold font-mono">
                      {t.role}
                    </span>
                  </div>
                </div>

                <CheckCircle2 className="w-5 h-5 text-brand-emerald shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

