import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  ShieldCheck,
  Award,
  Calendar,
  Building,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Institute of Trading Tricks",
  description:
    "Built on Real Floors, Not Marketing Theater. Institutional order flow training, live execution desks at Gul Arcade Plaza Islamabad, and genuine floor accountability.",
};

export default function AboutUsPage() {
  const facilities = [
    {
      tag: "FACILITY 01",
      badge: "LIVE EXECUTION",
      level: "DESK LEVEL 1",
      title: "Dedicated Trading Floor & Workstations",
      desc: "High-speed terminals, multi-screen setups, ergonomic chairs, and live institutional tape feeds.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBEI8jp5f9gJAJOgxyQsKzHmJ-Qd7kJEQzjQEoQoaLFNzgdt99G__1_X9tRhGgOvj-tZNW6rKVpNyB8abnahwSAtYT1fisX1nWPSuC9Q2nrB4wGu9mc-Q4w_H4lYOIoPS11WmHY620AIIGBy2QFkXCAw8O7LaegV4WSoM7e2swtDERWe2PAfueRLGK_Y-qiy0aqkyi9mOqII4ckEOqYSCQH7hYbtKoq-kfkOmGx4cxLxx2xD6B0Zx0Nq_8XpDFSU2ibLw",
    },
    {
      tag: "FACILITY 02",
      badge: "LIQUIDITY LAB",
      level: "CLASSROOM 01",
      title: "Executive Strategy Room & Live Audits",
      desc: "In-person trade dissection, volume profiling deep dives, and macro session briefings.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDO-bZ2l1RZ8lwztyMiokluwJm1a7UD6kDPnoKkqOImJf7YJ5UmhvILZFag-_ulBvRr_c84_q2iCK94hRQOyaSswlDckXsL-NCgEaY610GFwFoVDaLXSq17Ds532gcQZjfWy4IUlWiAqvrQksXIAwsNGbzfpHLEseGW7rMfqIiOWVGBsAkYOOaNFO-Krs8AWJq4RpTQqgi9iUjrcxKCLIGlVpCovxEukmMUi93UQllBy9c3pCujnWzH6_xdQdcYWCo3wQ",
    },
    {
      tag: "FACILITY 03",
      badge: "ACCREDITED",
      level: "BATCH HONORS",
      title: "Certified Student Graduations",
      desc: "On-site accreditation, disciplined prop firm protocol clearances, and trader awards.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCMerYgLwf4qy64sJqITxm7jAbDBP_ftyajCUUNNZoW75kpSW1A56ShJFiMg5knfPhWKaL9S2BpLykMtlb4rqWdIpyFZWvg1AvNWr5sWleDnLB6683wy9TElLFXoHmU-lwdN7pYNgV2Dxsw1xBeZkTa3TvnSf09tmYrH9djNUqGEImT5DNnQqSvB323rw44LyJ64HFnEA-jwwrjR7r9TiaP07xRPQX8Lqz_cUCyEYqh6Dep8wgdieA1jAAM-Ma6-GcaMg",
    },
    {
      tag: "FACILITY 04",
      badge: "OPEN SEMINAR",
      level: "EVERY SUNDAY",
      title: "Free Weekly In-Person Seminars",
      desc: "Sunday 6:00 PM at 3rd Floor Gul Arcade Plaza, PWD Road, Islamabad. Open to the public.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuASfX7_oS3YsmDVawAfU-Ap07nRifhzYBAhgQCbFuC3YGFC_z3KpD_1E2euPadLh3_h5xkbMSdprOc6W_HOgTgY9wMSrHsjQ79aiMIugZtmQXqbK5Y7rMorbhkt9WF3dEhwtHXi-E2iZl2HvM6U1KjVqSUjr-AXF0-LSy7l-FczSupO0sjvKUCN8hNjUltS0WP23TdeCp31wiqfXTgTC6yQ2SQ84n8FL01FH59rOaFp8UJp37Ns74XysBDXYoyMWXbSuA",
    },
  ];

  return (
    <div className="w-full bg-[#080d16] text-slate-200">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#080d16] py-20 lg:py-28 border-b border-slate-800/80">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 filter saturate-0 contrast-125"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCZA1V1ht27m23E_ppdw5PaH03QYoRRDvXJ4olCGvZLcS8o9n49F5u0k0ZRraobkEA3e5stA5XhDnj96yNysDVwQrgRNVMBsjqkX-IW9-1IiZuLRUSPw2U7bsQLIXO8IQ4-BvDIfw0hv3hB--KdNbrlEC_U_l_N6b_hMNW5ifsjOzPZ8FtZVaLxXRvEs0TWOGKlFjwt5rrwsZ23cqki4opbRj_uHgP9EikpU80k9R1h76rBZ2zh7fQnmVUaIPa-ngOasw')`,
            }}
          />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080d16] via-[#080d16]/90 to-[#080d16]/95" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-indigo-500/15 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 right-10 w-[380px] h-[380px] bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#0d1524]/90 backdrop-blur-md px-4 py-1.5 rounded-full ring-1 ring-emerald-500/40 shadow-xl mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
              A REAL PHYSICAL INSTITUTION • NOT AN ONLINE SMOKESCREEN
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl leading-[1.15]">
            Built on Real Floors,{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent underline decoration-emerald-500/40 decoration-wavy underline-offset-8">
              Not Marketing Theater
            </span>
            .
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mt-6 leading-relaxed font-normal">
            We provide institutional order flow training, live execution desks, and genuine floor accountability for serious market operators.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0d1524] border border-slate-800 text-xs font-mono text-slate-300 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gul Arcade Plaza, Islamabad</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0d1524] border border-slate-800 text-xs font-mono text-slate-300 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Physical Multi-Terminal Labs</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0d1524] border border-slate-800 text-xs font-mono text-slate-300 shadow-sm">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>On-Site Certification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Showcase */}
      <section className="w-full bg-[#080d16] py-20 lg:py-24 relative border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="font-mono text-xs text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                CAMPUS &amp; FACILITIES SHOWCASE
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Our Physical Trading Floor &amp; Campus
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-md">
              Step beyond discord channels. Train in an engineered environment with dedicated execution pods, auction theory labs, and physical mentor seating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac, i) => (
              <div
                key={i}
                className="group relative bg-[#0d1524] rounded-2xl overflow-hidden ring-1 ring-slate-800 border-t border-emerald-500/40 hover:ring-emerald-500/50 shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <img
                    alt={fac.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={fac.imageUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1524] via-transparent to-transparent opacity-90" />
                  <span className="absolute top-3 left-3 bg-[#05080e]/90 backdrop-blur-md font-mono text-[10px] font-bold text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/30">
                    {fac.tag}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {fac.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{fac.desc}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {fac.badge}
                    </span>
                    <span className="text-slate-400">{fac.level}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Spotlight */}
      <section className="w-full bg-[#080d16] py-20 relative overflow-hidden border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[#0d1524] via-[#101b2e] to-[#0a101b] p-8 sm:p-12 rounded-3xl border border-slate-800 border-t-emerald-500/40 shadow-2xl overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 relative flex justify-center">
                <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden ring-2 ring-emerald-500/40 shadow-2xl relative bg-[#05080e]">
                  <img
                    alt="Marcus Vance, Head Trader and Founder"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1U8dz9IVomwTLVrDzTDgCnBWzQUFBwM8_qW6z5LerFu2OrytfZrvmG3ef2vW49KgkuErdezIiJfqCwnkFUyz08E5B5D2b5A3u4KK9yLPT5YxSB7KRpIBRW0hZAC7e4z0F2HamKR2zvPfAE8y0zetW0m3Q0QvCX-TKbX3xA3NvgFWRYJbsOqtJQ_btOhi4NA6C-RvANuGkWm1UiynAzMgZ8q0haClp_N4pqaN80bw_lKIdE5IO5Nc8MkINg"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#05080e]/95 via-[#05080e]/60 to-transparent p-3 text-center">
                    <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider">
                      MARCUS VANCE
                    </span>
                    <p className="text-[10px] text-slate-300 uppercase font-mono">
                      Senior Liquidity Specialist
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-7 flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full w-fit">
                  <Award className="w-3.5 h-3.5" />
                  <span>HEAD TRADER &amp; FOUNDER</span>
                </div>
                <blockquote className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                  “Trading is not art — it is a probabilistic auction governed strictly by institutional liquidity.”
                </blockquote>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Prior to founding the Institute, Marcus operated on proprietary desks dissecting London fix liquidity imbalances and institutional delta skew. His framework eliminates subjective guesswork in favor of verified institutional physics.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="inline-flex items-center gap-2 bg-[#05080e] px-4 py-2 rounded-xl border border-slate-800">
                    <Building className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-xs font-bold text-white">7 Yrs Prop Desk</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-[#05080e] px-4 py-2 rounded-xl border border-slate-800">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-xs font-bold text-white">$18M+ Volume</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-[#05080e] px-4 py-2 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-xs font-bold text-white">87 Funded Passes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Principles & Growth Metrics */}
      <section className="w-full bg-[#080d16] py-20 relative border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="font-mono text-xs text-emerald-400 uppercase mb-2 tracking-widest flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              INSTITUTIONAL PILLARS
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Our Core Operating Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-[#0d1524] p-6 rounded-2xl border border-slate-800 border-t-emerald-500/40 hover:border-emerald-500/50 transition-all shadow-lg flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 font-mono font-bold">
                01
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Zero Theory Fluff</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We abandon retail chart patterns and laggy indicators. You learn direct limit order book mechanics, dealer stops, and real auction market profile dynamics.
                </p>
              </div>
            </div>

            <div className="bg-[#0d1524] p-6 rounded-2xl border border-slate-800 border-t-emerald-500/40 hover:border-emerald-500/50 transition-all shadow-lg flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 font-mono font-bold">
                02
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Mathematical Capital Preservation</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Prop desk survival is determined by drawdown mathematics. Our systematic 0.5% risk models ensure traders survive statistical losing runs intact.
                </p>
              </div>
            </div>

            <div className="bg-[#0d1524] p-6 rounded-2xl border border-slate-800 border-t-emerald-500/40 hover:border-emerald-500/50 transition-all shadow-lg flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 font-mono font-bold">
                03
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Desk Transparency</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mentors execute alongside members during live London &amp; New York cash open sessions. Every entry, slippage, and stop adjustment is observed in real-time.
                </p>
              </div>
            </div>
          </div>

          {/* Audited Performance Grid */}
          <div className="bg-[#0d1524] border border-slate-800 border-t-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-6 border-b border-slate-800/80 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full w-fit mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  AUDITED PERFORMANCE
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Verified Growth in Numbers
                </h3>
              </div>
              <div className="font-mono text-xs text-slate-400 bg-[#05080e] px-3.5 py-1.5 rounded-lg border border-slate-800 w-fit">
                ACADEMIC &amp; DESK AUDIT (2021 – 2026)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#05080e] p-5 rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 transition-all">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  Notional Monitored
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight font-mono mb-1">
                  $18M+
                </div>
                <p className="text-xs text-slate-400">Live desk volume executed</p>
              </div>

              <div className="bg-[#05080e] p-5 rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 transition-all">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  Monthly Desk Cuts
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight font-mono mb-1">
                  48+
                </div>
                <p className="text-xs text-slate-400">Live London/NY tape sessions</p>
              </div>

              <div className="bg-[#05080e] p-5 rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 transition-all">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  Prop Eval Pass Rate
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight font-mono mb-1">
                  88%
                </div>
                <p className="text-xs text-slate-400">Within 90-day disciplined protocol</p>
              </div>

              <div className="bg-[#05080e] p-5 rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 transition-all">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  Trader Retention
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight font-mono mb-1">
                  94.6%
                </div>
                <p className="text-xs text-slate-400">Active campus floor members</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="w-full bg-[#080d16] py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-[#0d1524] via-[#101c30] to-[#0d1524] p-8 sm:p-14 rounded-3xl border border-slate-800 border-t-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden text-center flex flex-col items-center">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full mb-4">
              <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">
                BATCH 12 REGISTRATION OPEN
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
              Trade Alongside Our Desk
            </h2>
            <p className="text-base text-slate-300 mb-8 max-w-xl leading-relaxed">
              Direct mentorship with Marcus Vance, physical floor access at Gul Arcade Plaza, live stream tape breakdowns, and funded evaluation blueprints.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_0_24px_rgba(16,185,129,0.35)] border border-emerald-400/40 active:scale-95"
              >
                <span>Secure Desk Seat — $499</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 bg-[#05080e] hover:bg-[#0c121e] text-white border border-slate-700 hover:border-emerald-500/50 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              >
                <span>Review Curriculum</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
