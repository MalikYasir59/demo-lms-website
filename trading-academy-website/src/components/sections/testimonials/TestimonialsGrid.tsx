"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, CheckCircle2 } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonials";

type CategoryFilter = "all" | "prop-firm" | "institutional" | "retail";

export default function TestimonialsGrid() {
  const [filter, setFilter] = useState<CategoryFilter>("all");

  const filteredList =
    filter === "all"
      ? TESTIMONIALS
      : TESTIMONIALS.filter((t) => t.category === filter);

  const filterTabs: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: "All Reviews" },
    { id: "prop-firm", label: "Prop Firm Funded" },
    { id: "institutional", label: "Institutional Desks" },
    { id: "retail", label: "Retail Transitions" },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#1E40AF] bg-[#E0E7FF] border border-[#1E40AF]/20 px-3 py-1 rounded">
            Community Wall
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Traders Worldwide
          </h2>
          <p className="text-slate-600 text-sm">
            Browse verified feedback from our global alumni passing tier-one evaluations.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                  filter === tab.id
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Masonry/Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((t) => (
            <div
              key={t.id}
              className="bg-[#faf8ff] p-6 rounded-2xl flex flex-col justify-between border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all gap-6 group"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-amber-400" />
                    ))}
                  </div>
                  {t.highlightProfit && (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold border border-emerald-300">
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

