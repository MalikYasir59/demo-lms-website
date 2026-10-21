import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PUBLIC_ASSETS } from "@/data/public-assets";
import HomeFaqAccordion from "@/components/sections/public/HomeFaqAccordion";

export const metadata: Metadata = {
  title: "Institute of Trading Tricks — Practical Forex Education in Islamabad",
  description:
    "Learn practical forex trading on a live trading floor in PWD, Islamabad — taught in person by the two mentors who founded the institute, Adnan Rana and Talha Hanif.",
};

export default function HomePage() {
  return (
    <div className="w-full">
      {/* =================================================================== */}
      {/* 1. HERO SECTION                                                     */}
      {/* =================================================================== */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Background Image & Trading Chart Overlay */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PUBLIC_ASSETS.heroBg}
            alt="Trading Floor Background"
            className="w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040714] via-[#050919]/90 to-[#050919]/65" />
          {/* Crisp SVG Candlestick/Line Chart Overlay on Right */}
          <svg
            className="absolute right-0 top-0 h-full w-2/3 opacity-25 pointer-events-none"
            viewBox="0 0 800 500"
            fill="none"
          >
            <path
              d="M50 380 L140 310 L210 345 L310 220 L390 260 L480 150 L570 290 L660 180 L760 95"
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            <path
              d="M50 420 L160 390 L260 410 L360 330 L450 360 L540 240 L640 270 L750 170"
              stroke="#D4C385"
              strokeWidth="1.8"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-5">
                <span className="w-6 h-px bg-[#D4C385]" />
                <span>FOREX &amp; DIGITAL SKILLS INSTITUTE · ISLAMABAD</span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.04] mb-6">
                Training for
                <br />
                <span className="italic text-[#D4C385] font-normal">better</span> trading.
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed mb-9">
                Learn practical forex trading on a live trading floor in PWD, Islamabad — taught in person by the two mentors who founded the institute.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="bg-[#D4C385] hover:bg-[#E5D7A3] text-[#040714] font-semibold text-[10px] tracking-[0.2em] uppercase px-6 py-3.5 transition"
                >
                  RESERVE YOUR SEAT
                </Link>
                <Link
                  href="/courses"
                  className="border border-white/20 hover:border-[#D4C385] text-white text-[10px] tracking-[0.2em] uppercase px-6 py-3.5 transition"
                >
                  VIEW COURSES →
                </Link>
              </div>
            </div>

            {/* Right Glass Rating Card */}
            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <Link
                href="/reviews"
                className="text-left bg-[#040714]/80 backdrop-blur-md border border-white/15 hover:border-[#D4C385]/50 px-5 py-4 max-w-xs w-full transition block"
              >
                <div className="text-[#D4C385] text-xs tracking-widest mb-1">★★★★★</div>
                <div className="font-display text-2xl text-white leading-tight">4.8 on Google</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  222 verified student reviews · Islamabad
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. LIVE MARKETS TICKER STRIP                                        */}
      {/* =================================================================== */}
      <div className="bg-[#040714] border-b border-white/10 py-2.5 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 text-[10px] tracking-wider whitespace-nowrap">
          <div className="flex items-center gap-2 text-slate-400 uppercase tracking-[0.18em]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>MARKETS</span>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400">EUR/USD</span>
              <span className="text-white font-medium ml-1">1.0842</span>
              <span className="text-rose-400 ml-1">-0.14%</span>
            </div>
            <div>
              <span className="text-slate-400">GBP/USD</span>
              <span className="text-white font-medium ml-1">1.2965</span>
              <span className="text-rose-400 ml-1">-0.09%</span>
            </div>
            <div>
              <span className="text-slate-400">USD/JPY</span>
              <span className="text-white font-medium ml-1">152.34</span>
              <span className="text-emerald-400 ml-1">+0.21%</span>
            </div>
            <div>
              <span className="text-slate-400">XAU/USD</span>
              <span className="text-white font-medium ml-1">2,742.80</span>
              <span className="text-emerald-400 ml-1">+0.64%</span>
            </div>
            <div>
              <span className="text-slate-400">BTC/USD</span>
              <span className="text-white font-medium ml-1">67,890</span>
              <span className="text-emerald-400 ml-1">+1.32%</span>
            </div>
            <div>
              <span className="text-slate-400">GBP/JPY</span>
              <span className="text-white font-medium ml-1">197.50</span>
              <span className="text-rose-400 ml-1">-0.18%</span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. 4-COLUMN STATS ROW                                               */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="font-display text-3xl sm:text-4xl text-[#D4C385] mb-1.5">10+ yrs</div>
              <div className="text-xs font-medium text-white">Mentor experience</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Certified in Dubai, Baku &amp; Thailand</div>
            </div>
            <div>
              <div className="font-display text-3xl sm:text-4xl text-[#D4C385] mb-1.5">4.8 ★</div>
              <div className="text-xs font-medium text-white">222 Google reviews</div>
              <div className="text-[11px] text-slate-400 mt-0.5">From students across our batches</div>
            </div>
            <div>
              <div className="font-display text-3xl sm:text-4xl text-[#D4C385] mb-1.5">03</div>
              <div className="text-xs font-medium text-white">Trading levels</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Basic, Advance &amp; Pro Trading Course</div>
            </div>
            <div>
              <div className="font-display text-3xl sm:text-4xl text-[#D4C385] mb-1.5">PKR 495k</div>
              <div className="text-xs font-medium text-white">Competition prize pool</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Held for students after completion</div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. WHY TRAIN HERE: A CLASSROOM, NOT A CHATROOM                      */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-3">
                <span className="w-5 h-px bg-[#D4C385]" />
                <span>WHY TRAIN HERE</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white leading-tight">
                A classroom, <span className="italic text-[#D4C385]">not</span> a chatroom.
              </h2>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <div className="text-[10px] tracking-[0.2em] text-[#D4C385] mb-2 font-mono">01</div>
                <h3 className="font-display text-xl text-white mb-2">Live floor desks</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Train in person at our PWD Islamabad campus with dedicated workstations and live market charts instead of anonymous signal groups.
                </p>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.2em] text-[#D4C385] mb-2 font-mono">02</div>
                <h3 className="font-display text-xl text-white mb-2">Founders teach</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every batch is taught directly by Adnan Rana and Talha Hanif — the two mentors who built and run the institute.
                </p>
              </div>
              <div>
                <div className="text-[10px] tracking-[0.2em] text-[#D4C385] mb-2 font-mono">03</div>
                <h3 className="font-display text-xl text-white mb-2">Real risk rules</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  From capital safety and position sizing to Smart Money Concepts (SMC) and ICT setups, you build a repeatable rulebook.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. TRADING PROGRAMS: THREE LEVELS. ONE PATH.                        */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-3">
                <span className="w-5 h-px bg-[#D4C385]" />
                <span>TRADING PROGRAMS</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white">Three levels. One path.</h2>
            </div>
            <Link
              href="/courses"
              className="text-[10px] tracking-[0.2em] uppercase text-slate-400 hover:text-[#D4C385] transition"
            >
              FULL SYLLABUS →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-white/10">
            {/* 01 Basic */}
            <div className="py-8 md:pr-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
              <div>
                <div className="font-display text-2xl text-slate-600 mb-4">01</div>
                <div className="text-[9px] tracking-[0.22em] uppercase text-[#D4C385] mb-1">BEGINNER</div>
                <h3 className="font-display text-2xl text-white mb-3">Basic</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  A beginner-friendly program designed to build a solid trading foundation — candlestick analysis, trend identification, moving averages and support &amp; resistance.
                </p>
              </div>
              <Link
                href="/courses"
                className="text-left text-[10px] tracking-[0.2em] uppercase text-slate-300 hover:text-[#D4C385] transition"
              >
                SEE MODULES →
              </Link>
            </div>

            {/* 02 Advance */}
            <div className="py-8 md:px-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
              <div>
                <div className="font-display text-2xl text-slate-600 mb-4">02</div>
                <div className="text-[9px] tracking-[0.22em] uppercase text-[#D4C385] mb-1">INTERMEDIATE</div>
                <h3 className="font-display text-2xl text-white mb-3">Advance</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  A deeper program built for traders who already know the basics — fundamental analysis, market sentiment, money management, risk-to-reward and trading psychology.
                </p>
              </div>
              <Link
                href="/courses"
                className="text-left text-[10px] tracking-[0.2em] uppercase text-slate-300 hover:text-[#D4C385] transition"
              >
                SEE MODULES →
              </Link>
            </div>

            {/* 03 Pro Trading Course */}
            <div className="py-8 md:pl-8 flex flex-col justify-between">
              <div>
                <div className="font-display text-2xl text-slate-600 mb-4">03</div>
                <div className="text-[9px] tracking-[0.22em] uppercase text-[#D4C385] mb-1">ADVANCED</div>
                <h3 className="font-display text-2xl text-white mb-3">Pro Trading Course</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  An advanced professional-level course covering complete SMC, volume indicators, ICT core concepts, Jugari trades, Fibonacci confluence and RSI divergence.
                </p>
              </div>
              <Link
                href="/courses"
                className="text-left text-[10px] tracking-[0.2em] uppercase text-slate-300 hover:text-[#D4C385] transition"
              >
                SEE MODULES →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. CURRICULUM FLOW                                                  */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-xl mb-12">
            <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-3">
              <span className="w-5 h-px bg-[#D4C385]" />
              <span>CURRICULUM FLOW</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-white leading-tight">
              From your first candle to your own strategy.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="text-[10px] text-slate-500 mb-2 font-mono">01</div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#D4C385] mb-1">FOUNDATION</div>
              <h3 className="font-display text-xl text-white mb-2">Read the chart</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Understand candle formations, uptrends, downtrends, SMA/EMA confirmation and key support and resistance levels.
              </p>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 mb-2 font-mono">02</div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#D4C385] mb-1">DISCIPLINE</div>
              <h3 className="font-display text-xl text-white mb-2">Control your risk</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Master position sizing, risk-to-reward ratios, macroeconomic news impact and emotional control in live sessions.
              </p>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 mb-2 font-mono">03</div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#D4C385] mb-1">EXECUTION</div>
              <h3 className="font-display text-xl text-white mb-2">Build a strategy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Combine Smart Money Concepts (SMC), ICT order blocks, fair value gaps and live volume into a personal trading plan.
              </p>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 mb-2 font-mono">04</div>
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#D4C385] mb-1">COMPETE</div>
              <h3 className="font-display text-xl text-white mb-2">Trading competition</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                After course completion, test your consistency in the institute trading competition with prizes up to PKR 285,000.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. THE MENTORS                                                      */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-3">
                <span className="w-5 h-px bg-[#D4C385]" />
                <span>THE MENTORS</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white leading-tight mb-4">
                Taught by the people who run it.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Adnan Rana and Talha Hanif lead every classroom batch in Islamabad, bringing over a decade of international trading and finance credentials.
              </p>
              <Link
                href="/about-us"
                className="text-[10px] tracking-[0.2em] uppercase text-slate-300 hover:text-[#D4C385] transition inline-block"
              >
                ABOUT THE INSTITUTE →
              </Link>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Mentor 1 */}
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PUBLIC_ASSETS.adnanRana}
                  alt="Adnan Rana"
                  className="w-40 h-40 rounded-full object-cover border border-white/15 mb-5"
                />
                <div className="text-[9px] tracking-[0.2em] uppercase text-[#D4C385] mb-1">
                  HEAD OF THE INSTITUTE
                </div>
                <h3 className="font-display text-2xl text-white mb-2">Adnan Rana</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Trading expert with an MBA in Finance and Marketing. Over a decade of experience in trading and finance, certified in Dubai, Baku and Thailand.
                </p>
              </div>
              {/* Mentor 2 */}
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PUBLIC_ASSETS.talhaHanif}
                  alt="Talha Hanif"
                  className="w-40 h-40 rounded-full object-cover border border-white/15 mb-5"
                />
                <div className="text-[9px] tracking-[0.2em] uppercase text-[#D4C385] mb-1">
                  MANAGING DIRECTOR
                </div>
                <h3 className="font-display text-2xl text-white mb-2">Talha Hanif</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  BBA-qualified trading expert with over a decade of experience in trading and finance, certified in Dubai, Baku and Thailand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 8. THE CAMPUS SPOTLIGHT                                             */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PUBLIC_ASSETS.campus}
                alt="Institute of Trading Tricks Campus"
                className="w-full h-64 sm:h-72 object-cover border border-white/10 shadow-xl"
              />
            </div>
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-3">
                <span className="w-5 h-px bg-[#D4C385]" />
                <span>THE CAMPUS</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white leading-tight mb-4">
                A trading floor, built for learning.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Our main campus in PWD Housing Society, Islamabad features dedicated workstations so students practice chart analysis and live execution side by side with their instructors.
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-6">
                3rd Floor, Gul Arcade Plaza, Opposite London Bakery, Main PWD Road, PWD Housing Society, Islamabad 44000
              </p>
              <Link
                href="/contact"
                className="border border-white/20 hover:border-[#D4C385] text-white text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 transition inline-block"
              >
                BOOK A VISIT →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 9. JOINING TAKES FOUR STEPS                                         */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-3">
                <span className="w-5 h-px bg-[#D4C385]" />
                <span>HOW TO JOIN</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white leading-tight mb-4">
                Joining takes four steps.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Not sure which level suits you? Visit the campus during opening hours and speak with our mentors before enrolling.
              </p>
              <Link
                href="/contact"
                className="bg-[#D4C385] hover:bg-[#E5D7A3] text-[#040714] font-semibold text-[10px] tracking-[0.2em] uppercase px-6 py-3 transition inline-block"
              >
                RESERVE YOUR SEAT
              </Link>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card-surface p-6">
                <div className="font-display text-xl text-[#D4C385] mb-2">01</div>
                <h3 className="font-display text-xl text-white mb-1.5">Get in touch</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Send an enrollment request online or message us on WhatsApp with your preferred course.
                </p>
              </div>
              <div className="card-surface p-6">
                <div className="font-display text-xl text-[#D4C385] mb-2">02</div>
                <h3 className="font-display text-xl text-white mb-1.5">Free counselling</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Visit our PWD campus to see a live class and confirm whether to start at Basic, Advance or Pro.
                </p>
              </div>
              <div className="card-surface p-6">
                <div className="font-display text-xl text-[#D4C385] mb-2">03</div>
                <h3 className="font-display text-xl text-white mb-1.5">Confirm your seat</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Register for the upcoming batch in Islamabad, Wah Cantt or Attock and get your desk assigned.
                </p>
              </div>
              <div className="card-surface p-6">
                <div className="font-display text-xl text-[#D4C385] mb-2">04</div>
                <h3 className="font-display text-xl text-white mb-1.5">Start learning</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Train on live charts, complete your modules and enter the student trading competition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 10. GOOGLE REVIEWS HIGHLIGHTS                                       */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-2">— REVIEWS</div>
            <h2 className="font-display text-3xl sm:text-4xl text-white">
              Rated 4.8 out of 5 on Google Reviews
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="card-surface p-6 flex flex-col justify-between">
              <div>
                <div className="text-[#D4C385] font-display text-2xl leading-none mb-3">❞</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Alhamdulillah my trading course has been completed. I learned Forex trading from the institute and now I&apos;m making very good trades and generating solid profits. Highly recommended.
                </p>
              </div>
              <div className="flex items-center justify-between text-[9px] tracking-[0.16em] uppercase text-slate-500 pt-4 border-t border-white/5">
                <span>VERIFIED GOOGLE REVIEW</span>
                <span>15 JAN 2026</span>
              </div>
            </div>

            <div className="card-surface p-6 flex flex-col justify-between">
              <div>
                <div className="text-[#D4C385] font-display text-2xl leading-none mb-3">❞</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  I especially liked their teaching style — clear, patient and practical. The environment feels comfortable, and they make learning Forex enjoyable instead of stressful.
                </p>
              </div>
              <div className="flex items-center justify-between text-[9px] tracking-[0.16em] uppercase text-slate-500 pt-4 border-t border-white/5">
                <span>VERIFIED GOOGLE REVIEW</span>
                <span>22 NOV 2025</span>
              </div>
            </div>

            <div className="card-surface p-6 flex flex-col justify-between">
              <div>
                <div className="text-[#D4C385] font-display text-2xl leading-none mb-3">❞</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Great trading institute! The instructors explain concepts clearly, from basics to advanced strategies. The environment is supportive, and I gained real confidence in my trading. Thanks sir Adnan and sir Talha.
                </p>
              </div>
              <div className="flex items-center justify-between text-[9px] tracking-[0.16em] uppercase text-slate-500 pt-4 border-t border-white/5">
                <span>VERIFIED GOOGLE REVIEW</span>
                <span>22 NOV 2025</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/reviews"
              className="text-[10px] tracking-[0.2em] uppercase text-slate-400 hover:text-[#D4C385] transition inline-block"
            >
              READ ALL 222 REVIEWS →
            </Link>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 11. FROM THE CHANNEL (VIDEOS)                                       */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-3">
                <span className="w-5 h-px bg-[#D4C385]" />
                <span>WATCH · 125 VIDEOS</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white">From the channel</h2>
            </div>
            <Link
              href="/videos"
              className="text-[10px] tracking-[0.2em] uppercase text-slate-400 hover:text-[#D4C385] transition"
            >
              ALL VIDEOS →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/videos" className="text-left group block">
              <div className="relative overflow-hidden border border-white/10 mb-3 aspect-video bg-[#0A1026]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PUBLIC_ASSETS.videoMain}
                  alt="Fundamental class happening live right now"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <span className="w-10 h-10 rounded-full bg-[#D4C385]/90 text-[#040714] flex items-center justify-center text-xs font-bold pl-0.5">
                    ▶
                  </span>
                </div>
              </div>
              <div className="text-[9px] tracking-[0.16em] uppercase text-slate-500 mb-1">10 APR 2026</div>
              <div className="font-display text-lg text-white group-hover:text-[#E5D7A3] transition">
                Fundamental class happening live right now
              </div>
            </Link>

            <Link href="/videos" className="text-left group block">
              <div className="relative overflow-hidden border border-white/10 mb-3 aspect-video bg-[#0A1026]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PUBLIC_ASSETS.videoCert}
                  alt="Dawn Expo & Student Stories"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <span className="w-10 h-10 rounded-full bg-[#D4C385]/90 text-[#040714] flex items-center justify-center text-xs font-bold pl-0.5">
                    ▶
                  </span>
                </div>
              </div>
              <div className="text-[9px] tracking-[0.16em] uppercase text-slate-500 mb-1">22 NOV 2025</div>
              <div className="font-display text-lg text-white group-hover:text-[#E5D7A3] transition">
                Dawn Expo &amp; student achievement highlights
              </div>
            </Link>

            <Link href="/videos" className="text-left group block">
              <div className="relative overflow-hidden border border-white/10 mb-3 aspect-video bg-[#0A1026]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PUBLIC_ASSETS.videoClass}
                  alt="Master Support & Resistance with Sir Talha"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <span className="w-10 h-10 rounded-full bg-[#D4C385]/90 text-[#040714] flex items-center justify-center text-xs font-bold pl-0.5">
                    ▶
                  </span>
                </div>
              </div>
              <div className="text-[9px] tracking-[0.16em] uppercase text-slate-500 mb-1">13 NOV 2025</div>
              <div className="font-display text-lg text-white group-hover:text-[#E5D7A3] transition">
                Master Support &amp; Resistance with Sir Talha
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 12. BEFORE YOU ENROL (FAQ)                                          */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-3">
                <span className="w-5 h-px bg-[#D4C385]" />
                <span>QUESTIONS</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-white leading-tight mb-3">
                Before you enrol.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Straight answers to common questions before you visit our campus in PWD, Islamabad.
              </p>
            </div>

            <div className="lg:col-span-8">
              <HomeFaqAccordion />
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 13. BOTTOM GLOW CTA: LEARN. TRADE. GROW                             */}
      {/* =================================================================== */}
      <section className="center-glow py-24 text-center px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-[10px] tracking-[0.24em] uppercase text-[#D4C385] mb-3">
            ISLAMABAD · WAH CANTT · ATTOCK
          </div>
          <h2 className="font-display text-4xl sm:text-6xl text-white mb-4">
            Learn. Trade. Grow
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
            Send an enquiry or visit our PWD Islamabad campus Monday to Saturday to reserve your seat in the next batch.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="bg-[#D4C385] hover:bg-[#E5D7A3] text-[#040714] font-semibold text-[10px] tracking-[0.2em] uppercase px-6 py-3.5 transition"
            >
              RESERVE YOUR SEAT
            </Link>
            <Link
              href="/courses"
              className="border border-white/20 hover:border-[#D4C385] text-white text-[10px] tracking-[0.2em] uppercase px-6 py-3.5 transition"
            >
              VIEW COURSES
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
