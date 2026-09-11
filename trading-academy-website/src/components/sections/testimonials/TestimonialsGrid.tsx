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
    <section className="w-full px-4 sm:px-6 lg:px-12 py-20 bg-[#0B0F17] border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <span className="label-telemetry text-[#c0c1ff] bg-[#6366F1]/15 border border-[#6366F1]/30 px-3.5 py-1 rounded-full">
            Community Wall
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trusted by Traders Worldwide
          </h2>
          <p className="text-[#94A3B8] text-sm">
            Browse verified feedback from our global alumni passing tier-one evaluations.
          </p>

          {/* Obsidian Apex Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {filterTabs.map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer label-telemetry ${
                    isActive
                      ? "bg-[#6366F1]/15 text-white border border-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.30)]"
                      : "bg-[#0B0F17] text-[#94A3B8] border border-white/[0.06] hover:border-white/20 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((t) => (
            <div
              key={t.id}
              className="bg-[#121824]/90 backdrop-blur-xl p-6 rounded-lg flex flex-col justify-between border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] hover:border-[#6366F1]/40 hover:shadow-[0_0_24px_rgba(99,102,241,0.15)] transition-all gap-6 group"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#F59E0B]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-[#F59E0B]" />
                    ))}
                  </div>
                  {t.highlightProfit && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-[11px] font-mono font-bold border border-[#10B981]/30 tabular-nums label-telemetry">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
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
                    <span className="text-xs text-[#10B981] font-semibold font-mono label-telemetry">
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
