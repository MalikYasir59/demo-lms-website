import React from "react";
import Link from "next/link";
import { ArrowRight, Play, Star, CheckCircle2, Zap } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#04160c] pt-36 sm:pt-40 lg:pt-44 pb-24 lg:pb-32 border-b border-emerald-500/20">
      {/* Dynamic Visual Atmospherics */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#020d07]/80 via-[#031810]/30 to-[#04160c]/90" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.18] bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/Mainbg1.JPG')",
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#04160c]/95 via-[#04160c]/35 to-[#020d07]/10" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-emerald-500/5 blur-[2px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[480px] h-[320px] bg-[#0d6938]/5 blur-[2px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/4 w-[520px] h-[340px] bg-emerald-500/4 blur-[2px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10 flex flex-col items-center text-center">
        {/* Urgent Live Enrollment Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 border border-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.28)] backdrop-blur-xl">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="font-mono text-xs text-emerald-400 font-bold tracking-wider uppercase">
            BATCH 12 LIVE ENROLLMENT • ISLAMABAD CAMPUS &amp; LMS • 8 SEATS REMAINING
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="mt-7 text-4xl sm:text-6xl lg:text-7xl font-black text-white max-w-4xl tracking-tight leading-[1.08]">
          Master Institutional Trading.
          <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300 drop-shadow-[0_0_35px_rgba(16,185,129,0.45)]">
            Zero Fluff, Pure Execution.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-2xl text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
          Proprietary institutional order flow tape, daily London &amp; New York live execution, in-person mentorship at our physical Islamabad campus, and 24/7 student LMS access.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link
            href="/#pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#3980f5] via-[#03346c] to-[#3980f5] hover:from-[#2e72f0] hover:to-[#2e72f0] text-white text-sm font-extrabold shadow-[0_0_35px_rgba(16,185,129,0.5)] border border-emerald-300/60 hover:scale-[1.02] transition-all group"
          >
            <span>Enroll &amp; Instant LMS Access — $499</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/#founder-masterclass"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-black/50 hover:bg-black/80 text-white text-sm font-semibold border border-emerald-500/40 backdrop-blur-xl hover:border-emerald-400 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all group"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Watch Founder Masterclass (12:40)</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="font-bold text-white">4.9/5</span>
            <span className="text-slate-400">(640+ Reviews)</span>
          </div>
          <span className="text-emerald-500/50 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Verified by 2,800+ Funded Traders</span>
          </div>
          <span className="text-emerald-500/50 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span className="font-bold">Instant LMS Dashboard Setup</span>
          </div>
        </div>

        {/* 4-Stat Box */}
        <div className="mt-12 w-full max-w-4xl rounded-2xl bg-black/60 backdrop-blur-2xl p-5 sm:p-6 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-emerald-500/20">
            <div className="flex flex-col items-center p-2">
              <span className="font-mono text-3xl sm:text-4xl text-emerald-400 font-black tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                2,800+
              </span>
              <span className="font-mono text-[11px] text-slate-300 uppercase tracking-wider mt-1 font-bold">
                Students Trained
              </span>
            </div>
            <div className="flex flex-col items-center p-2 pt-4 sm:pt-2">
              <span className="font-mono text-3xl sm:text-4xl text-emerald-400 font-black tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                4.9 / 5.0
              </span>
              <span className="font-mono text-[11px] text-slate-300 uppercase tracking-wider mt-1 font-bold">
                Verified Audit Rating
              </span>
            </div>
            <div className="flex flex-col items-center p-2 pt-4 sm:pt-2">
              <span className="font-mono text-3xl sm:text-4xl text-white font-black tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                88%
              </span>
              <span className="font-mono text-[11px] text-slate-300 uppercase tracking-wider mt-1 font-bold">
                Prop Pass Rate
              </span>
            </div>
            <div className="flex flex-col items-center p-2 pt-4 sm:pt-2">
              <span className="font-mono text-3xl sm:text-4xl text-emerald-400 font-black tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                Instant
              </span>
              <span className="font-mono text-[11px] text-slate-300 uppercase tracking-wider mt-1 font-bold">
                LMS Activation (&lt;60s)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
