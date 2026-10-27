import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Courses | Institute of Trading Tricks",
  description:
    "Three trading levels — Basic, Advance and Pro — taught at our Islamabad campus, plus digital skills programs in marketing, graphic design, and web development.",
};

export default function CoursesPage() {
  return (
    <div className="w-full">
      {/* =================================================================== */}
      {/* 1. PAGE HERO                                                        */}
      {/* =================================================================== */}
      <section className="hero-glow border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-4">
            <span className="w-5 h-px bg-[#D4C385]" />
            <span>COURSES</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">Pick your level</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
            Three trading levels — Basic, Advance and Pro — taught at our Islamabad campus, plus digital skills programs.
          </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. 3 TRADING COURSE CARDS                                           */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* CARD 1: BASIC */}
            <div className="card-surface p-7 flex flex-col justify-between">
              <div>
                <div className="text-[9px] tracking-[0.22em] uppercase text-[#D4C385] mb-1.5 font-mono">
                  BEGINNER
                </div>
                <h2 className="font-display text-3xl text-white mb-3">Basic</h2>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  A beginner-friendly program designed to build a solid trading foundation.
                </p>

                <ul className="space-y-3 text-xs text-slate-300 leading-relaxed mb-8">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Candlestick analysis — candle formation, bullish &amp; bearish patterns, reversal and continuation signals</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Trend identification — uptrend, downtrend and sideways markets</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Moving averages — SMA &amp; EMA, trend confirmation, entry &amp; exit signals</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Support &amp; resistance — key market levels, breakouts &amp; retests, avoiding false signals</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Account creation</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Live trading setup</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">Fee on request</span>
                <Link
                  href="/contact?course=Basic+(Beginner)"
                  className="bg-[#D4C385] hover:bg-[#E5D7A3] text-[#040714] font-semibold text-[10px] tracking-[0.18em] uppercase px-4 py-2 transition"
                >
                  ENQUIRE
                </Link>
              </div>
            </div>

            {/* CARD 2: ADVANCE */}
            <div className="card-surface p-7 flex flex-col justify-between">
              <div>
                <div className="text-[9px] tracking-[0.22em] uppercase text-[#D4C385] mb-1.5 font-mono">
                  INTERMEDIATE
                </div>
                <h2 className="font-display text-3xl text-white mb-3">Advance</h2>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  A deeper program built for traders who already know the basics.
                </p>

                <ul className="space-y-3 text-xs text-slate-300 leading-relaxed mb-8">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Fundamental analysis in depth — economic events, market impact and macroeconomic factors</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Market sentiment — sentiment-driven movement and identifying sentiment shifts</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Money management — capital safety, position sizing and risk allocation</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Risk-to-reward ratio — RR calculations, trade selection and optimisation</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Trading psychology — emotional control, avoiding fear &amp; greed, professional mindset</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Price action patterns — 10–12 high-probability patterns with entry/exit rules</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">Fee on request</span>
                <Link
                  href="/contact?course=Advance+(Intermediate)"
                  className="bg-[#D4C385] hover:bg-[#E5D7A3] text-[#040714] font-semibold text-[10px] tracking-[0.18em] uppercase px-4 py-2 transition"
                >
                  ENQUIRE
                </Link>
              </div>
            </div>

            {/* CARD 3: PRO TRADING COURSE */}
            <div className="card-surface p-7 flex flex-col justify-between">
              <div>
                <div className="text-[9px] tracking-[0.22em] uppercase text-[#D4C385] mb-1.5 font-mono">
                  ADVANCED
                </div>
                <h2 className="font-display text-3xl text-white mb-3">Pro Trading Course</h2>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  An advanced professional-level course designed for serious and career-focused traders.
                </p>

                <div className="bg-[#D4C385]/10 border border-[#D4C385]/35 px-3.5 py-2.5 text-[11px] text-[#E5D7A3] mb-5">
                  Premium paid indicator included free on completion
                </div>

                <ul className="space-y-3 text-xs text-slate-300 leading-relaxed mb-8">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Complete SMC (Smart Money Concepts) — market structure, liquidity, institutional models</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Volume indicator — reading volume in live markets as a leading indicator</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>ICT core concepts — fair value gaps, order blocks, power of three</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Jugari trades — fast-execution techniques and quick-entry setups</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Strategy building — combining SMC, price action and risk-to-reward</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>Fibonacci tools — retracement, extension and practical confluence</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>RSI &amp; divergence — strong and hidden divergence for early reversal calls</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">Fee on request</span>
                <Link
                  href="/contact?course=Pro+Trading+Course+(Advanced)"
                  className="bg-[#D4C385] hover:bg-[#E5D7A3] text-[#040714] font-semibold text-[10px] tracking-[0.18em] uppercase px-4 py-2 transition"
                >
                  ENQUIRE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. DIGITAL COURSES                                                  */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="font-display text-3xl text-white mb-2">Digital courses</h2>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed mb-8">
            Alongside trading, the institute runs practical digital-skill programs. Ask about the current batch and fee for any of these.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="card-surface p-6">
              <h3 className="font-display text-xl text-white mb-3">Digital Marketing</h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>Meta Ads</li>
                <li>Google Ads</li>
                <li>SEO</li>
                <li>TikTok Ads</li>
                <li>LinkedIn</li>
              </ul>
            </div>

            <div className="card-surface p-6">
              <h3 className="font-display text-xl text-white mb-3">Graphic Design</h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>Adobe Photoshop</li>
                <li>Adobe Illustrator</li>
                <li>Video editing (CapCut)</li>
                <li>Canva</li>
                <li>AI tools</li>
              </ul>
            </div>

            <div className="card-surface p-6">
              <h3 className="font-display text-xl text-white mb-3">Website Development</h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>Frontend</li>
                <li>Backend</li>
                <li>React, Laravel</li>
                <li>MongoDB</li>
              </ul>
            </div>

            <div className="card-surface p-6">
              <h3 className="font-display text-xl text-white mb-3">E-Commerce</h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>Shopify</li>
                <li>eBay</li>
                <li>Store setup &amp; development</li>
                <li>Market &amp; product research</li>
                <li>Sourcing &amp; inventory management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. TRADING COMPETITION & FULL COURSE BROCHURE                       */}
      {/* =================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Trading competition */}
          <div className="card-surface p-8">
            <div className="text-[#D4C385] mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 21h8m-4-4v4m-5-9a5 5 0 01-3-4.58V5h16v2.42A5 5 0 0117 12m-10 0a5 5 0 0010 0M7 5V4h10v1"
                />
              </svg>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-white mb-2">Trading competition</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              After course completion the institute holds a trading competition for its students.
            </p>
            <div className="divide-y divide-white/10 text-xs">
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-300">1st prize</span>
                <span className="font-display text-lg text-[#D4C385]">PKR 285,000</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-300">2nd prize</span>
                <span className="font-display text-lg text-[#D4C385]">PKR 140,000</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-300">3rd prize</span>
                <span className="font-display text-lg text-[#D4C385]">PKR 70,000</span>
              </div>
            </div>
          </div>

          {/* Right: Full course brochure */}
          <div className="card-surface p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl text-white mb-3">Full course brochure</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Every module of the Basic, Advance and Pro programs, the digital courses and the competition prizes — in one PDF.
              </p>
              <Link
                href="/contact"
                className="bg-[#1D4ED8] hover:bg-[#2563EB] text-white text-[10px] tracking-[0.2em] uppercase font-medium px-5 py-3 inline-flex items-center gap-2 transition mb-6"
              >
                <span>↓</span>
                <span>DOWNLOAD BROCHURE</span>
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Prefer to talk it through? Call{" "}
              <a href="tel:+923077330777" className="text-slate-200 underline hover:text-[#D4C385]">
                +92 307 7330777
              </a>{" "}
              or send an email to{" "}
              <a
                href="mailto:instituteoftradingtricks@gmail.com"
                className="text-slate-200 underline hover:text-[#D4C385]"
              >
                instituteoftradingtricks@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
