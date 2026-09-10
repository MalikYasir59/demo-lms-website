import React from "react";
import Link from "next/link";
import { ArrowRight, Check, Star } from "lucide-react";
import { COURSES } from "@/data/courses";

export default function CourseShowcase() {
  const course = COURSES[0];

  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-brand-surface border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="bg-brand-navy-card rounded-3xl border border-slate-800 p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            {/* Left Info */}
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-brand-emerald text-xs font-mono font-bold uppercase tracking-wider">
                  FLAGSHIP CURRICULUM
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-mono">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>4.9 / 5.0 Rating</span>
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                {course.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {course.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {course.outcomes.slice(0, 4).map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href={`/courses/${course.slug}`}
                  className="px-6 py-3.5 rounded-xl bg-brand-emerald hover:bg-brand-emerald-hover text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
                >
                  <span>Explore Curriculum &amp; Modules</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/courses/${course.slug}#pricing`}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors"
                >
                  View Pricing ($499)
                </Link>
              </div>
            </div>

            {/* Right Card: Quick Specs */}
            <div className="w-full lg:w-80 bg-[#070b14] border border-slate-800 rounded-2xl p-6 flex flex-col gap-5 shadow-xl shrink-0">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold border-b border-slate-800 pb-3">
                Course Highlights
              </span>
              <div className="flex flex-col gap-3 font-mono text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-bold text-white">45+ Hours</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">Modules</span>
                  <span className="font-bold text-white">6 Core Modules</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">Lessons</span>
                  <span className="font-bold text-white">24 High-Def Lessons</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">Access</span>
                  <span className="font-bold text-emerald-400">Lifetime + Updates</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Community</span>
                  <span className="font-bold text-white">Private Discord</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

