import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Layers,
  Clock,
  BarChart2,
  ShieldCheck,
  Calculator,
  Brain,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calendar,
  Award,
  GraduationCap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Courses & Curriculum | Institute of Trading Tricks",
  description:
    "Institutional Curriculum. 6 modules. Zero fluff. Pure execution. Proprietary order flow, session timing killzones, AMD models, and physical Islamabad floor workstations.",
};

export default function CoursesPage() {
  const modules = [
    {
      num: "MOD 01",
      title: "Order Flow & Liquidity",
      desc: "Order blocks, fair value gaps, dynamic volume profiling",
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: "MOD 02",
      title: "Session Timing & Killzones",
      desc: "London 07:00 UTC open & NY 12:00 UTC institutional sweeps",
      icon: <Clock className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: "MOD 03",
      title: "Liquidity Sweeps & AMD",
      desc: "Accumulation, Manipulation, Distribution schematics",
      icon: <BarChart2 className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: "MOD 04",
      title: "Prop Firm Challenge Engine",
      desc: "Capital preservation rules & trailing drawdown mitigation",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: "MOD 05",
      title: "Mathematical Risk Geometry",
      desc: "Fractional Kelly position sizing & strict 1:3 RR targets",
      icon: <Calculator className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: "MOD 06",
      title: "Trader Psychology & Tilt",
      desc: "Eliminating revenge execution with strict journal reviews",
      icon: <Brain className="w-5 h-5 text-emerald-400" />,
    },
  ];

  return (
    <div className="w-full bg-[#080B11] flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pt-36 sm:pt-40 lg:pt-44 pb-20 border-b border-white/[0.06]">
        <div className="absolute inset-0 pointer-events-none">
          <img
            alt="Trading Floor Ambience"
            className="w-full h-full object-cover opacity-15 filter grayscale contrast-125"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjJmSyRxBWY7Mqq4IS5QQATsJsy_5ttB1QTpMW5EJs1eFEEFIzMUYNAfLkw1LRp25worPTwjaFtrGyQi94AOEC5pxdddmX1hc0JZ5D0JbIRThZ20Bjs-iGIw1U-HP0qPEEcGCOtU20yT3TmjwR-Km3-2H26D3ZD0bAfllc5bk2q-dM4cEe8GuvOSPxnlkrk987G9s1elPI94_-39bwSJyTFEbCvR-KGyXRKAGM1SXv6bPSADHvoG8Ea-Vtp3sOVvU-3A"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,11,17,0.85)_70%,#080B11_100%)]" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#0d6938]/25 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#121722]/90 border border-emerald-500/30 px-3.5 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-bold text-emerald-400 tracking-widest uppercase">
              CURRICULUM SPECIFICATION
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Institutional Curriculum
          </h1>

          <p className="text-lg sm:text-xl font-medium mb-8">
            <span className="text-emerald-400 font-semibold">6 modules.</span>{" "}
            <span className="text-slate-400">Zero fluff.</span>{" "}
            <span className="text-emerald-400 font-semibold">Pure execution.</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 bg-[#121722] border border-emerald-500/25 px-4 py-2 rounded-lg shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wider">
                6 Comprehensive Modules
              </span>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#121722] border border-emerald-500/25 px-4 py-2 rounded-lg shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wider">
                48+ Hands-on Labs
              </span>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#121722] border border-white/10 px-4 py-2 rounded-lg shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wider">
                Lifetime LMS Portal Access
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus Grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider uppercase block mb-1">
              Core Training Syllabus
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Step-by-Step Operator Progression
            </h2>
          </div>
          <span className="font-mono text-xs text-slate-400 hidden sm:inline-block">
            6 PHASES • PROP VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, idx) => (
            <div
              key={idx}
              className="bg-[#121722] rounded-xl p-6 border border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#171F2E] transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-emerald-400 tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {mod.num}
                  </span>
                  <div className="text-slate-400 group-hover:text-emerald-400 transition-colors">
                    {mod.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {mod.title}
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                <span>{mod.desc}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Real Physical Infrastructure */}
      <section className="w-full bg-[#0d121c] py-20 border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-12 text-center md:text-left">
            <div>
              <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                REAL INFRASTRUCTURE
              </span>
              <h2 className="text-3xl lg:text-4xl text-white font-bold tracking-tight">
                Included In Your Desk Enrollment
              </h2>
            </div>
            <span className="font-mono text-xs text-slate-400 uppercase">
              ISLAMABAD DESK + DIGITAL LMS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Terminal Workstations */}
            <div className="bg-[#121722] rounded-xl overflow-hidden border border-white/[0.08] hover:border-emerald-500/40 flex flex-col group transition-all shadow-xl">
              <div className="h-52 w-full overflow-hidden relative">
                <img
                  alt="Dedicated Terminal Workstations"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvbWUiab9NBF9V5DF9EvvGUVmPTHx7De0ywiSru3JYlhM5fqeZ7-Gxq_WrW_vWhkAMSTHMyYv5N20OALjyEoEHQP4e2K3rLyr1MrCKjVJq3XD7SEq68SAVdga2h9fc4401iRsCP4UXergJ3ySrGCS0rMxCXHalCRLoViOpMTXIOFB4xjBf2BvwJcvchA0ikagYpZMG4dfiRM3Rakem1sy-sYWVWtFunKqMU0UfKpaE7B7Y3hfkIROBju70C8HSVlTyyQ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121722] via-transparent to-black/30" />
                <span className="absolute top-3 left-3 font-mono text-[11px] bg-[#01411C] border border-emerald-500/40 text-emerald-300 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  PHYSICAL TRADING FLOOR
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                    Dedicated Terminal Workstations
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    High-speed dual-display terminal stations connected directly to institutional execution routing and multi-asset charting desks.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Floor access 5 days / week</span>
                </div>
              </div>
            </div>

            {/* Strategy Room */}
            <div className="bg-[#121722] rounded-xl overflow-hidden border border-white/[0.08] hover:border-emerald-500/40 flex flex-col group transition-all shadow-xl">
              <div className="h-52 w-full overflow-hidden relative">
                <img
                  alt="Strategy Room &amp; Live Audits"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzjdRl_XA-r3g1tFIzcbogLs5KfNzzuKE_TOV5CrPIe6TaeLgwhMOaQ6Ssmwnd9o77V3JqdZa3IgNHoqJepzJ1oiRximSnxfI7Nhu41XA4OCIEgNELPZt1aN9nufdzkVi0DA6Ye7hJmHoSWnjYsmpDDSkPUx6sFBX7PLwbWapiK-06crc33OgZWzSLhRb6DqCl3Dbiwh96KLu-Re57UHeKdJTnCA1xh_QcRAbqHk6JzDAJ7Lv74pjaBPb4zPKTaxgj_Q"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121722] via-transparent to-black/30" />
                <span className="absolute top-3 left-3 font-mono text-[11px] bg-emerald-500 text-black font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  DESK AUDITS
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                    Strategy Room &amp; Audits
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Glassed execution hall for live session breakdown, real-time trader post-mortems, and trade-by-trade mentor debriefings.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>1-on-1 performance review</span>
                </div>
              </div>
            </div>

            {/* Graduations & Mentorship */}
            <div className="bg-[#121722] rounded-xl overflow-hidden border border-white/[0.08] hover:border-emerald-500/40 flex flex-col group transition-all shadow-xl">
              <div className="h-52 w-full overflow-hidden relative">
                <img
                  alt="Student Graduations &amp; Mentorship"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAycmmS_MVpk7R3tw-PFR26f-EYU581BVyRWXY_8e8rKEw-MyaRdrD8DIVVOtIkOvLjYkhenJhEeXtn3T7AzcFVH7NtHPKk8KVrzQLd1kQ8i4Z4XOWzB5mM2XfqnWHdwzyHDqxjXCbLICHzKLmMqY4D6ZNAbzher6BtpyBwxTRDKvSqjIAfUoPiPu23nS2q92CI6RwNMiPDOO3ndYnltL1mrD3lhu1yLUJ-W3GpMgvOv9ZUXOm1SANZBPENULgHr2-3Mg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121722] via-transparent to-black/30" />
                <span className="absolute top-3 left-3 font-mono text-[11px] bg-[#01411C] border border-emerald-500/40 text-emerald-300 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  CERTIFICATION
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                    Student Graduations &amp; Mentorship
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Recognized accreditation upon passing simulated evaluation, pairing successful traders into institutional funded pipelines.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Official Completion Certificate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Free Seminar Banner */}
          <div className="mt-8 bg-gradient-to-br from-[#121722] to-[#171F2E] rounded-xl border border-emerald-500/30 overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-2xl">
            <div className="w-full md:w-5/12 h-64 md:h-72 overflow-hidden relative flex-shrink-0">
              <img
                alt="Free Forex Trading Seminar &amp; Workshop"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0nJXHX-I5z5s3zRJUKMGThd_sln9U4bqpu_9pEg4vblzPCETvYhszwRyGVrcqM6oJebAhZzkzS9XxV407cFdv1fvtoB63KjydcDp5RKqCbN0RahEeS_CHybChZT6g_czw7_QAE_ZB4b8rVqn41i_wQADGbOXi7dIJo7Wc1I209NqOmiz6dxyvxd-E6V5e-1QD3qyI0-68S_d9LIU6uFDxUZDBrBcA1jxVfpAvWQFD9lELZs4JoQ5hqJosSEInt3vAoQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-transparent to-[#121722]/80" />
              <div className="absolute top-3 left-3">
                <span className="font-mono text-xs bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded uppercase tracking-wider shadow">
                  Free Live Workshop
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between w-full">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Sunday 6:00 PM
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="font-mono text-xs text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> 3rd Floor Gul Arcade Plaza, Opposite London Bakery, Main PWD Road, Islamabad
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl text-white font-bold mb-2">
                  Free On-Site Forex Seminar &amp; Live Workshop
                </h3>
                <p className="text-xs md:text-sm text-slate-300 mb-4 leading-relaxed">
                  Experience our trading floor in person. Sit in on live chart setups, institutional liquidity sweep demonstrations, and speak directly with professional mentors before committing to desk enrollment.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/[0.08]">
                <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Real Charts
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Live Demos
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Strategy Setup
                  </span>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#0d6938] hover:bg-[#095029] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(13,105,56,0.4)] transition-all"
                >
                  <span>Reserve Free Seat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="max-w-4xl mx-auto px-4 lg:px-8 py-20 w-full">
        <div className="bg-gradient-to-b from-[#0e1a12] to-[#080B11] rounded-2xl p-8 sm:p-12 shadow-[0_0_50px_rgba(16,185,129,0.15)] border border-emerald-500/40 text-center relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#0d6938]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 bg-[#01411C] text-emerald-300 px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider mb-4 font-bold border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              INSTANT ACCESS TO INSTITUTE LMS PORTAL
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white font-extrabold tracking-tight mb-3">
              Instant Access to Institute LMS Portal — $499
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
              One-time transparent fee. Immediate dashboard provisioning with lifetime access to all 6 modules, proprietary indicators, and live floor recordings.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full text-left mb-8">
              <div className="flex items-center gap-2 text-slate-200 text-xs bg-[#121722] px-4 py-3 rounded-lg border border-white/[0.06]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Dedicated Student LMS Account &amp; Dashboard</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 text-xs bg-[#121722] px-4 py-3 rounded-lg border border-white/[0.06]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Full 4K Video Lecture Archive (35+ Hours)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 text-xs bg-[#121722] px-4 py-3 rounded-lg border border-white/[0.06]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Daily NY &amp; London Live Trade Replays</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 text-xs bg-[#121722] px-4 py-3 rounded-lg border border-white/[0.06]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Interactive Quizzes &amp; Algorithmic Logs</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 text-xs bg-[#01411C]/60 px-4 py-3 rounded-lg border border-emerald-500/40 sm:col-span-2 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-semibold text-emerald-300">
                  14-Day Action Guarantee • Instant Password Dispatch
                </span>
              </div>
            </div>

            <Link
              href="/contact?tier=batch12"
              className="inline-flex items-center justify-center gap-2 bg-[#0d6938] hover:bg-[#095029] text-white px-8 py-4 rounded-xl text-base font-extrabold shadow-[0_0_30px_rgba(13,105,56,0.45)] transition-all transform hover:-translate-y-0.5"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Enroll &amp; Get Instant LMS Access — $499</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="font-mono text-xs text-emerald-400 font-semibold mt-3">
              Immediate automated email credential dispatch upon payment
            </p>

            <div className="flex flex-wrap justify-center items-center gap-3 mt-6 text-slate-400 font-mono text-xs">
              <span>LIFETIME ENROLLMENT</span>
              <span>•</span>
              <span>24/7 LMS VIDEO VAULT</span>
              <span>•</span>
              <span>INSTANT PORTAL ACTIVATION</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
