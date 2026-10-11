import React from "react";
import Link from "next/link";
import { PlayCircle, Radio, LineChart, Tv, History, BarChart3, ShieldCheck, Headphones } from "lucide-react";

export default function StudentLMSPlatform() {
  return (
    <section
      className="w-full bg-[#080B11] py-20 border-t border-white/[0.08] relative overflow-hidden"
      id="lms-portal"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-luminosity bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/Mainbg3.JPG')",
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#080B11]/70 via-transparent to-[#080B11]/80" />
      <div className="absolute -top-10 right-10 w-[500px] h-[300px] bg-emerald-500/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[450px] h-[280px] bg-[#0d6938]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="px-4 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
            PROPRIETARY LEARNING MANAGEMENT SYSTEM
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your All-In-One Student LMS &amp; Execution Portal
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Direct 24/7 web &amp; mobile access with automated video track progression and session archives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: LMS Interface Mockup */}
          <div className="lg:col-span-7 rounded-2xl bg-[#121722] border border-white/[0.08] p-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <img
                  alt="LMS Logo"
                  className="h-6 w-6 rounded-full border border-indigo-400/40"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkFirvfbFSTFPYanxNAblBG5qHqwLHVqg0zmjn7jb_9Mt1ZBCMiVQqsYkeZiTDSH3fpQKv6yITZAI8zcPlqr33s7ER-8AzOMA0hapVosbKjvBgkzUobxmgImtn45_3eEbVpfcJGyNxqAY7H-APr0xiY55eIC2SMuVcdgqf3V2ecy4IuzuIMhELPmxdL7bHBEmIVs2DHJ35fE4JQ0_sFoOPlD1DXFL_qEmYOgqBtOVytkl2MkJZLSsznvYh0Bb2vvhRtw"
                />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  ITT Execution LMS v4.2
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ACTIVE STUDENT
                </span>
              </div>
            </div>

            <div className="mt-4 bg-[#0c1018] rounded-xl p-4 border border-white/[0.06] flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3.5 border-b border-white/[0.06]">
                <div>
                  <p className="font-mono text-[11px] text-indigo-400 uppercase font-bold tracking-wider">
                    Active Curriculum Track
                  </p>
                  <h4 className="text-base font-bold text-white mt-0.5">
                    Module 03: Order Flow &amp; Institutional Footprint
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className="font-mono text-xs text-emerald-400 font-bold">78% Completed</span>
                  <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full w-[78%]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-[#182030] border border-white/[0.06] hover:border-emerald-400/40 transition-all">
                  <div className="flex items-center justify-between text-emerald-400 mb-1.5">
                    <PlayCircle className="w-4 h-4" />
                    <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                      NEXT LESSON
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white line-clamp-1">
                    Lesson 3.4: London Open Fair Value Gap Sweeps
                  </p>
                  <span className="font-mono text-[11px] text-slate-400 mt-1 block">
                    42 Mins • HD 4K Video
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#182030] border border-white/[0.06] hover:border-indigo-400/30 transition-all">
                  <div className="flex items-center justify-between text-indigo-400 mb-1.5">
                    <Radio className="w-4 h-4" />
                    <span className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      LIVE DESK REPLAY
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white line-clamp-1">
                    NY Session Live Tape Analysis (March 30)
                  </p>
                  <span className="font-mono text-[11px] text-slate-400 mt-1 block">
                    Uploaded 18m ago • Recorded Desk
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#080B11] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                    <LineChart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      Position Size &amp; Drawdown Safety Matrix
                    </p>
                    <p className="font-mono text-[10px] text-slate-400">
                      Auto-syncs with FTMO, Topstep &amp; Apex accounts
                    </p>
                  </div>
                </div>
                <Link
                  href="/#pricing"
                  className="px-2.5 py-1 rounded bg-[#182030] border border-white/[0.08] font-mono text-[11px] text-emerald-400 font-bold hover:bg-emerald-500/10 transition-colors"
                >
                  Launch Tool
                </Link>
              </div>
            </div>
          </div>

          {/* Right: 5 Features List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="p-4 rounded-xl bg-[#121722] border border-white/[0.08] hover:border-indigo-400/40 transition-all flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">4K Video Masterclasses</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  35+ recorded lessons organized by module with modular progress tracking and downloadable PDF playbooks.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#121722] border border-white/[0.08] hover:border-emerald-400/40 transition-all flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Daily Live Session Recordings</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Missed London (08:00 UTC) or NY open? Stream replays with time-stamped breakdown markers within 30 minutes.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#121722] border border-white/[0.08] hover:border-indigo-400/40 transition-all flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Interactive Trade Journal &amp; Analytics</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Log your setups, calculate risk per tick, and track win rates across institutional sessions seamlessly.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#121722] border border-white/[0.08] hover:border-emerald-400/40 transition-all flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Prop Firm Challenge Simulator</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Practice strict drawdown limits and max trailing buffers before attempting paid funded challenges.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#121722] border border-white/[0.08] hover:border-emerald-400/40 transition-all flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Direct Desk Q&amp;A &amp; Mentor Support</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  One-click ticket dispatch directly to Marcus and floor mentors for personalized chart audits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

