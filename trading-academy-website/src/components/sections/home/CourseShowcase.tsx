import React from "react";
import Link from "next/link";
import { ArrowRight, Check, Star } from "lucide-react";
import { COURSES } from "@/data/courses";

export default function CourseShowcase() {
  const course = COURSES[0];

  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#080B11] border-b border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="bg-[#121824]/95 rounded-lg border border-white/[0.08] p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_20px_48px_-12px_rgba(0,0,0,0.75)]">
          {/* Ambient Controlled Luminescence */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            {/* Left Info */}
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-mono font-bold uppercase tracking-wider label-telemetry">
                  FLAGSHIP CURRICULUM
                </span>
                <div className="flex items-center gap-1.5 text-[#F59E0B] text-xs font-mono tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>4.9 / 5.0 Rating</span>
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {course.title}
              </h2>

              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                {course.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {course.outcomes.slice(0, 4).map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#E2E8F0]">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href={`/courses/${course.slug}`}
                  className="px-6 py-3 rounded bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white font-bold text-sm border border-white/20 shadow-[0_0_16px_rgba(99,102,241,0.40)] hover:shadow-[0_0_24px_rgba(99,102,241,0.65)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <span>Explore Curriculum &amp; Modules</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/courses/${course.slug}#pricing`}
                  className="px-6 py-3 rounded bg-[#182234] hover:bg-[#1f2c42] text-[#E2E8F0] hover:text-white border border-white/[0.08] hover:border-[#6366F1]/40 font-semibold text-sm transition-all"
                >
                  View Pricing ($499)
                </Link>
              </div>
            </div>

            {/* Right: Metrics & Curriculum Breakdown Card */}
            <div className="w-full lg:w-96 bg-[#0B0F17]/95 rounded-lg border border-white/[0.08] p-6 flex flex-col gap-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <span className="label-telemetry text-slate-400">
                  COHORT SPECIFICATIONS
                </span>
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              </div>

              <div className="flex flex-col gap-4 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-[#94A3B8]">Active Enrollment</span>
                  <span className="text-white font-bold tabular-nums">Cohort #14</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-[#94A3B8]">Curriculum Duration</span>
                  <span className="text-white font-bold tabular-nums">6 Weeks + Lifetime</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-[#94A3B8]">Video Telemetry</span>
                  <span className="text-white font-bold tabular-nums">45+ Hours HD</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-[#94A3B8]">Live Floor Sessions</span>
                  <span className="text-[#10B981] font-bold tabular-nums">Weekly London/NY</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-[#94A3B8]">Community Desk</span>
                  <span className="text-[#6366F1] font-bold">24/7 Discord Analyst</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="label-telemetry text-[#94A3B8] text-[10px]">
                    Tuition Investment
                  </span>
                  <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                    $499
                  </span>
                </div>
                <Link
                  href={`/courses/${course.slug}#pricing`}
                  className="px-4 py-2 rounded bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white text-xs font-bold shadow-[0_0_12px_rgba(99,102,241,0.40)] hover:shadow-[0_0_18px_rgba(99,102,241,0.60)] transition-all"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
