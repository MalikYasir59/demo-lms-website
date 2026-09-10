import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Layers, BarChart, Monitor, Star, Play } from "lucide-react";
import { Course } from "@/types";

interface CourseHeroProps {
  course: Course;
}

export default function CourseHero({ course }: CourseHeroProps) {
  return (
    <section className="relative bg-brand-navy text-white py-16 lg:py-24 overflow-hidden terminal-grid border-b border-slate-800" id="overview">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left: Course Info */}
          <div className="flex flex-col gap-6 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-xs font-mono font-medium shadow-inner w-max">
              <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
              <span className="text-brand-emerald font-bold uppercase tracking-wider">
                FLAGSHIP MASTERCLASS
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">{course.cohort}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              {course.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {course.subtitle}
            </p>

            {/* Specifications Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-800 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-emerald" />
                <span>Duration: {course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-emerald" />
                <span>Modules: {course.modules.length} Core</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart className="w-4 h-4 text-brand-emerald" />
                <span>Level: {course.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-brand-emerald" />
                <span>Self-Paced + Live</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="#pricing"
                className="px-7 py-3.5 rounded-lg bg-brand-emerald hover:bg-brand-emerald-hover text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
              >
                <span>Enroll in Full Course — $499</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#curriculum"
                className="px-6 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
              >
                Preview Curriculum
              </Link>
            </div>
          </div>

          {/* Right: Terminal Video Preview Chrome */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-lg bg-[#0b1220] p-4 sm:p-5 rounded-2xl shadow-2xl border border-slate-700/80 flex flex-col gap-4 relative">
              <div className="absolute -top-3.5 -right-3 bg-brand-emerald text-slate-950 font-black px-3.5 py-1 rounded text-xs font-mono shadow-lg flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{course.rating}/5 — {course.studentsCount}+ Students</span>
              </div>

              {/* Terminal Window Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald" />
                  <span className="font-mono text-slate-400 text-[11px] ml-2">
                    TERMINAL_MODULE_01_PREVIEW.MP4
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                  HD 1080P
                </span>
              </div>

              {/* Candlestick Screen Visual */}
              <div className="relative aspect-video rounded-xl bg-[#070b14] flex items-center justify-center overflow-hidden border border-slate-800">
                <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 400 200">
                  <line stroke="#1e293b" strokeDasharray="2" strokeWidth="1" x1="0" x2="400" y1="40" y2="40" />
                  <line stroke="#1e293b" strokeDasharray="2" strokeWidth="1" x1="0" x2="400" y1="100" y2="100" />
                  <line stroke="#1e293b" strokeDasharray="2" strokeWidth="1" x1="0" x2="400" y1="160" y2="160" />
                  {/* Candlesticks */}
                  <line stroke="#ef4444" strokeWidth="2" x1="40" x2="40" y1="60" y2="130" />
                  <rect fill="#ef4444" height="40" width="10" x="35" y="75" />
                  <line stroke="#10b981" strokeWidth="2" x1="80" x2="80" y1="70" y2="150" />
                  <rect fill="#10b981" height="50" width="10" x="75" y="80" />
                  <line stroke="#ef4444" strokeWidth="2" x1="130" x2="130" y1="90" y2="170" />
                  <rect fill="#ef4444" height="45" width="10" x="125" y="105" />
                  <line stroke="#10b981" strokeWidth="2" x1="190" x2="190" y1="50" y2="160" />
                  <rect className="candlestick-glow" fill="#10b981" height="70" width="10" x="185" y="65" />
                  <line stroke="#10b981" strokeWidth="2" x1="250" x2="250" y1="40" y2="120" />
                  <rect fill="#10b981" height="35" width="10" x="245" y="55" />
                  <line stroke="#ef4444" strokeWidth="2" x1="310" x2="310" y1="30" y2="110" />
                  <rect fill="#ef4444" height="40" width="10" x="305" y="45" />
                  {/* Structure Path */}
                  <path d="M40 95 L130 130 L190 65 L250 55 L310 85" fill="none" stroke="#f59e0b" strokeDasharray="3" strokeWidth="1.5" />
                </svg>

                {/* Play Button */}
                <div className="relative z-20 flex flex-col items-center">
                  <button
                    type="button"
                    aria-label="Play course preview"
                    className="w-16 h-16 rounded-full bg-brand-emerald hover:bg-brand-emerald-hover text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </button>
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-center font-mono text-[10px] text-slate-400 bg-slate-900/90 px-3 py-1 rounded border border-slate-800">
                  <span className="text-brand-emerald font-semibold">
                    Module_01_Liquidity_Sweep.mp4
                  </span>
                  <span>42:15</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                  Includes downloadable templates &amp; order flow cheatsheets
                </span>
                <span className="text-brand-emerald font-bold">Lifetime Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Ribbon Strip */}
      <div className="mt-16 bg-[#0b1220] border-t border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div className="border-l-2 border-brand-emerald pl-4">
            <div className="text-2xl font-extrabold text-white font-mono">$14.2M+</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
              Total Prop Funded
            </div>
          </div>
          <div className="border-l-2 border-brand-emerald pl-4">
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">84.6%</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
              Challenge Pass Rate
            </div>
          </div>
          <div className="border-l-2 border-brand-emerald pl-4">
            <div className="text-2xl font-extrabold text-white font-mono">{course.studentsCount}+</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
              Enrolled Alumni
            </div>
          </div>
          <div className="border-l-2 border-brand-emerald pl-4">
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">1 : 3.4</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
              Avg Reward : Risk
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

