import React from "react";
import Link from "next/link";
import { ArrowRight, Play, Shield, Terminal } from "lucide-react";

export default function HomeHero() {
  return (
    <section
      className="relative bg-[#070b14] text-white pt-16 pb-24 overflow-hidden terminal-grid border-b border-slate-800"
      id="hero"
    >
      {/* Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
        {/* Free Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 text-xs font-mono font-medium mb-6 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-brand-emerald animate-ping" />
          <span className="text-brand-emerald font-bold uppercase tracking-wider text-[11px]">
            Free Series
          </span>
          <span className="text-slate-500">|</span>
          <span>Institutional Order Flow Playbook</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Learn Price Action &amp; Market Structure{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-200">
            — Free
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Institutional-grade order flow, quantitative liquidity engineering, and algorithmic market structure. Engineered by Canary Wharf prop desk traders to pass evaluations.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/courses/price-action-mastery"
            className="px-7 py-3.5 rounded-xl bg-brand-emerald hover:bg-brand-emerald-hover text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2 group"
          >
            <span>Access Free Playbook</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/courses/price-action-mastery#pricing"
            className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors flex items-center gap-2"
          >
            <span>View Masterclass Cohort</span>
          </Link>
        </div>

        {/* Trust Chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-brand-emerald" />
            Zero Lagging Retail Indicators
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-blue-400" />
            Prop Firm Challenge Ready
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
            Live London/NY Floor Active
          </span>
        </div>

        {/* Terminal Chrome Interactive Live Chart Simulation */}
        <div className="mt-14 w-full max-w-4xl bg-brand-navy-card rounded-2xl border border-slate-700/80 shadow-2xl p-4 sm:p-6 overflow-hidden">
          {/* Chrome Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-brand-emerald" />
              <span className="text-slate-400 text-[11px] ml-2 hidden sm:inline">
                TERMINAL // EURUSD.PRO // LONDON_KILLZONE
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[11px] font-bold">
                ORDER FLOW DEPTH: ACTIVE
              </span>
              <span className="text-slate-400 hidden sm:inline">SPREAD: 0.1 PIP</span>
            </div>
          </div>

          {/* SVG Candlestick Chart with Order Flow Lines */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-xl bg-[#05080f] overflow-hidden border border-slate-800/80 flex items-center justify-center">
            <svg
              className="w-full h-full p-4"
              viewBox="0 0 800 300"
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              <line stroke="#1e293b" strokeDasharray="3" strokeWidth="1" x1="0" x2="800" y1="60" y2="60" />
              <line stroke="#1e293b" strokeDasharray="3" strokeWidth="1" x1="0" x2="800" y1="120" y2="120" />
              <line stroke="#1e293b" strokeDasharray="3" strokeWidth="1" x1="0" x2="800" y1="180" y2="180" />
              <line stroke="#1e293b" strokeDasharray="3" strokeWidth="1" x1="0" x2="800" y1="240" y2="240" />

              {/* Liquidity Sweep Zone */}
              <rect x="360" y="30" width="120" height="40" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeDasharray="4" strokeWidth="1" />
              <text x="370" y="55" fill="#10b981" fontSize="10" fontFamily="monospace">
                LIQUIDITY SWEEP // 1.08950
              </text>

              {/* Bearish & Bullish Candles */}
              <line stroke="#ef4444" strokeWidth="2" x1="60" x2="60" y1="90" y2="200" />
              <rect fill="#ef4444" height="60" width="14" x="53" y="110" />

              <line stroke="#ef4444" strokeWidth="2" x1="120" x2="120" y1="110" y2="220" />
              <rect fill="#ef4444" height="70" width="14" x="113" y="130" />

              <line stroke="#10b981" strokeWidth="2" x1="180" x2="180" y1="100" y2="210" />
              <rect fill="#10b981" height="50" width="14" x="173" y="120" />

              <line stroke="#ef4444" strokeWidth="2" x1="240" x2="240" y1="80" y2="230" />
              <rect fill="#ef4444" height="80" width="14" x="233" y="110" />

              {/* Stop Hunt Wick Downward */}
              <line stroke="#ef4444" strokeWidth="2" x1="300" x2="300" y1="130" y2="270" />
              <rect fill="#ef4444" height="30" width="14" x="293" y="140" />

              {/* Massive Institutional Surge Candle */}
              <line stroke="#10b981" strokeWidth="2" x1="360" x2="360" y1="40" y2="200" />
              <rect fill="#10b981" height="110" width="14" x="353" y="60" className="candlestick-glow" />

              {/* Continuation Candles */}
              <line stroke="#10b981" strokeWidth="2" x1="420" x2="420" y1="30" y2="150" />
              <rect fill="#10b981" height="70" width="14" x="413" y="45" />

              <line stroke="#ef4444" strokeWidth="2" x1="480" x2="480" y1="40" y2="160" />
              <rect fill="#ef4444" height="40" width="14" x="473" y="60" />

              <line stroke="#10b981" strokeWidth="2" x1="540" x2="540" y1="20" y2="130" />
              <rect fill="#10b981" height="75" width="14" x="533" y="35" className="candlestick-glow" />

              <line stroke="#10b981" strokeWidth="2" x1="600" x2="600" y1="15" y2="110" />
              <rect fill="#10b981" height="50" width="14" x="593" y="30" />

              {/* Structure Line */}
              <path
                d="M60 140 L180 120 L300 250 L360 60 L480 80 L540 35 L600 30"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4"
              />
            </svg>

            {/* Live Callout Badge */}
            <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
              <span className="text-white">BOS CONFIRMED: 1.09240</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

