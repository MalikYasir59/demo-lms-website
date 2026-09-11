import React from "react";
import Image from "next/image";
import { Play, ArrowRight, CheckCircle2 } from "lucide-react";
import { FEATURED_CASE_STUDY } from "@/data/testimonials";

export default function FeaturedVideoCase() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-16 bg-[#080B11] border-b border-white/[0.06] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#121824]/95 backdrop-blur-xl rounded-lg p-6 sm:p-8 lg:p-12 border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_20px_48px_-12px_rgba(0,0,0,0.75)] relative overflow-hidden flex flex-col lg:flex-row items-center gap-10">
          {/* Ambient light glow */}
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)] pointer-events-none" />

          {/* Left: Video Preview Thumbnail */}
          <div className="w-full lg:w-1/2 flex flex-col gap-3">
            <div className="relative aspect-video rounded overflow-hidden border border-white/[0.08] bg-[#080B11] group shadow-lg">
              <Image
                src={FEATURED_CASE_STUDY.thumbnailUrl}
                alt="Case Study Video"
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-transparent to-black/40" />

              {/* Play Button Trigger */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  aria-label="Play Case Study"
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.50)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-7 h-7 fill-current ml-1" />
                </button>
              </div>

              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-xs font-mono text-slate-300">
                <span className="text-[#10B981] font-bold label-telemetry">CASE_STUDY_MARCUS_200K.MP4</span>
                <span className="bg-[#0B0F17]/90 px-2 py-0.5 rounded border border-white/[0.08] text-[10px] tabular-nums">
                  14:32 MINS
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                Verified Live Broker Payout Slip Included
              </span>
              <span className="text-[#10B981] font-semibold label-telemetry">Tier-1 Prop Firm</span>
            </div>
          </div>

          {/* Right: Quote & Metrics */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-mono font-bold uppercase tracking-wider label-telemetry">
                SPOTLIGHT CASE STUDY
              </span>
              <span className="text-xs text-slate-400 font-mono tabular-nums">• {FEATURED_CASE_STUDY.passTime}</span>
            </div>

            <blockquote className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              &ldquo;{FEATURED_CASE_STUDY.quote}&rdquo;
            </blockquote>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-white/[0.06] text-xs font-mono">
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 label-telemetry">Total Allocation</span>
                <span className="text-lg font-extrabold text-white tabular-nums">
                  {FEATURED_CASE_STUDY.allocation}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 label-telemetry">Challenge Duration</span>
                <span className="text-lg font-extrabold text-[#10B981] tabular-nums">
                  {FEATURED_CASE_STUDY.passTime}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 label-telemetry">Max Drawdown</span>
                <span className="text-lg font-extrabold text-white tabular-nums">
                  {FEATURED_CASE_STUDY.drawdown}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex flex-col">
                <span className="font-bold text-white text-base">
                  {FEATURED_CASE_STUDY.name}
                </span>
                <span className="text-xs text-[#10B981] font-mono font-semibold label-telemetry">
                  {FEATURED_CASE_STUDY.role}
                </span>
              </div>

              <a
                href="/courses/price-action-mastery"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c0c1ff] hover:text-white font-mono transition-colors label-telemetry"
              >
                <span>View Full Curriculum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
