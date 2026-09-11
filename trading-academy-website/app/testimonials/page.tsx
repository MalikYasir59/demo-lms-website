import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Calendar,
  Award,
  Monitor,
  Users,
  Star,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Client & Testimonials | Institute of Trading Tricks",
  description:
    "Audited payouts. Real funded traders. No paper gains. $4.8M+ cumulative verified payouts across FTMO, FundedNext, Apex Trader, and Topstep.",
};

export default function TestimonialsPage() {
  const payouts = [
    {
      firm: "FTMO $100K",
      certId: "#FT-84920",
      amount: "+$14,500.00",
      trader: "Liam S. (UK)",
      flag: "🇬🇧",
      date: "March 2025",
      badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    },
    {
      firm: "FUNDEDNEXT $200K",
      certId: "#FN-29104",
      amount: "+$24,650.00",
      trader: "Marcus T. (US)",
      flag: "🇺🇸",
      date: "March 2025",
      badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      firm: "APEX $300K",
      certId: "#AP-99412",
      amount: "+$46,300.00",
      trader: "Darius W. (AU)",
      flag: "🇦🇺",
      date: "March 2025",
      badgeClass: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    },
    {
      firm: "TOPSTEP $150K",
      certId: "#TS-62180",
      amount: "+$21,400.00",
      trader: "Elena R. (CH)",
      flag: "🇨🇭",
      date: "March 2025",
      badgeClass: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    },
  ];

  const studentReviews = [
    {
      name: "Hamza Tariq",
      location: "Rawalpindi, PK",
      badge: "On-Site Islamabad Floor",
      payout: "$14,800 FTMO Disbursed",
      quote:
        "Attending the physical floor in Gul Arcade changed everything. Watching Marcus execute during the 08:00 UTC London open eliminated my retail indicator bad habits within 3 weeks.",
      rating: 5,
    },
    {
      name: "Alexey Volkov",
      location: "Tallinn, Estonia",
      badge: "LMS Portal v4.2 Student",
      payout: "$22,400 FundedNext Payout",
      quote:
        "The mathematical risk geometry matrix in Module 5 prevents you from blowing funded evaluation buffers. Passed both phases without a single maximum daily loss breach.",
      rating: 5,
    },
    {
      name: "Tariq Mahmood",
      location: "Islamabad, PK",
      badge: "Batch 11 Floor Graduate",
      payout: "$31,200 Apex Futures",
      quote:
        "Having direct terminal access and in-person review on Sundays gives you an edge you cannot find anywhere online. The community here takes prop trading as a serious career.",
      rating: 5,
    },
    {
      name: "Sophia Chen",
      location: "Singapore",
      badge: "Remote Desk Streamer",
      payout: "$18,500 Topstep Express",
      quote:
        "The daily New York session replays uploaded within 30 minutes let me trade institutional sweeps with precision even while working full-time in Asia.",
      rating: 5,
    },
  ];

  return (
    <div className="w-full bg-[#080B11] text-slate-200">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#080B11] px-4 sm:px-8 pt-16 pb-20 border-b border-slate-800/80">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            alt="Trading Floor Atmosphere"
            className="w-full h-full object-cover object-center opacity-15 mix-blend-luminosity filter blur-[1px] scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzrkyXswlliLWSPRs7zjBin_67rV-QqMiQaBVcXMOZzsjtehe5bfW8qUA0dCOnVtTzQyykVSSasbKOh5kpg-3tpfEM34AsIFwSctKLrlsOHGjCRdMquGzQcUVySjga3-w5sRefLbvrbQg6wDu42jKwQ6YfnbqwRdB_WXUYbYTK307lz_DbKBGXwBJGPy1vsVuRR7UZw1TRI40NwzLznUXNPZThJ0EVFVPYNPoI54nPifVMfNtzS14vGhzAFnP_2gz5tA"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080B11]/90 via-[#080B11]/85 to-[#080B11]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(13,105,56,0.25),transparent_70%)]" />
        </div>

        <div className="relative max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-[#121722]/90 border border-emerald-500/40 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)] mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest">
              LIVE AUDITED PROOF
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white font-extrabold tracking-tight mb-3">
            Verified Results &amp;{" "}
            <span className="text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              Proof
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl mb-12 font-medium">
            Audited payouts. Real funded traders. No paper gains.
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div className="relative group bg-[#121722]/90 backdrop-blur-md p-6 rounded-xl text-center border border-emerald-500/30 shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:border-emerald-400/60 transition-all duration-300">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              <div className="font-mono text-4xl lg:text-5xl text-emerald-400 font-extrabold mb-1 tracking-tight">
                $4.8M+
              </div>
              <div className="text-sm font-bold text-emerald-200 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cumulative Payouts</span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 mt-2 uppercase tracking-wider font-semibold">
                1,840+ Funded Members
              </div>
            </div>

            <div className="relative group bg-[#121722]/90 backdrop-blur-md p-6 rounded-xl text-center border border-emerald-500/30 shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:border-emerald-400/60 transition-all duration-300">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              <div className="font-mono text-4xl lg:text-5xl text-emerald-400 font-extrabold mb-1 tracking-tight">
                74.2%
              </div>
              <div className="text-sm font-bold text-emerald-200 flex items-center justify-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Phase 1 Pass Rate</span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 mt-2 uppercase tracking-wider font-semibold">
                vs. 8.3% Industry Avg
              </div>
            </div>

            <div className="relative group bg-[#121722]/90 backdrop-blur-md p-6 rounded-xl text-center border border-slate-700/80 shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:border-indigo-500/40 transition-all duration-300">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
              <div className="font-mono text-4xl lg:text-5xl text-emerald-400 font-extrabold mb-1 tracking-tight">
                $11.8K
              </div>
              <div className="text-sm font-bold text-slate-200 flex items-center justify-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Avg Desk Payout</span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 mt-2 uppercase tracking-wider font-semibold">
                Bi-Weekly Verified Wires
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Physical Campus Proof */}
      <section className="w-full bg-[#080B11] py-20 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl text-white font-bold tracking-tight">
                  Physical Proof &amp; Campus Verification
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Real training centers, certified students, and transparent floor mentorship.
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto inline-flex items-center gap-1.5 text-emerald-400 font-mono text-xs bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified Academy Trading Floors
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121722] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col group hover:border-emerald-500/50 transition-all duration-300">
              <div className="relative w-full aspect-[4/3] bg-[#0D111A] overflow-hidden">
                <img
                  alt="Official Seminar and Live Workshop"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhtc1JXk3PzirEm1hBH1ZQFIG2aakYyKuuon6ZocZxQQBwn6pTUJoueGiJPZJg6to4AHr3BBn0JGUlUMB8x4i-FGXfiqrnEt4sz1sDQnG7aKNJvqIfFpYcy2bdhcC6XipE8E7l2v9alzBZb61qvaEpuuqJ4c7aqFxW7m0LOZb4OBTCZIM-lNbz8Lu-91oymK_4qT2gSv31sKiggThAqxz0FV_dzi7qmgPe3Iykj8_1mUq9v9ybnBu2-RucUpl9PS96BQ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121722] via-transparent to-black/40" />
                <div className="absolute top-3 left-3 bg-[#121722]/95 backdrop-blur-md text-emerald-300 border border-emerald-500/40 font-mono text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Islamabad Campus • Sunday 6 PM</span>
                </div>
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded">
                  <span>Gul Arcade Plaza, PWD Road</span>
                  <span className="text-emerald-400 font-semibold">Free Entry Pass</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow justify-between bg-[#121722]">
                <div>
                  <h3 className="text-lg text-white font-bold">
                    Live Physical Seminars &amp; Free Workshops
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Direct masterclass with senior prop traders. Real chart breakdowns, live institutional setups, and execution Q&amp;A.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-mono font-semibold">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> Weekly Floor Session
                  </span>
                  <span className="text-slate-400">Islamabad, PK</span>
                </div>
              </div>
            </div>

            <div className="bg-[#121722] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col group hover:border-emerald-500/50 transition-all duration-300">
              <div className="relative w-full aspect-[4/3] bg-[#0D111A] overflow-hidden">
                <img
                  alt="Real Student Certificate Award"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCth6H_d9bGUYKvilsHh2e_CUxp_TeeZq7x7aCTB6o-XHwFBXbQS7WGcoafe4UmLAJqpyzs3Xwq3zvG3tUdFknmcuPCEAp0uq0LipfHqLJ_iXzxr0MsIJpTqLurrQA5-cCHWP7UMwsOHyhqItIO3EBx7rg35iFmi-Q1r_rOvyGIkHTD7OqXgmubmNFGvqKCGKiiYuDaQA7DuoPfNi6r3KTsx_T9i88r5wjfmWbRFoJjA3VOANx2kDXbYlleI_-vZ4LS5A"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121722] via-transparent to-black/40" />
                <div className="absolute top-3 left-3 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 font-mono text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>On-Site Batch Completion</span>
                </div>
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded">
                  <span>Batch 11 Desk Graduate</span>
                  <span className="text-emerald-400 font-semibold">Cert #ITT-9042</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow justify-between bg-[#121722]">
                <div>
                  <h3 className="text-lg text-white font-bold">
                    Real Students, Real Certifications
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Physical desk verification and formal graduation awards. Each student is rigorously evaluated before prop capital deployment.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-mono font-semibold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Audited Verification
                  </span>
                  <span className="text-slate-400">Institute Floor</span>
                </div>
              </div>
            </div>

            <div className="bg-[#121722] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col group hover:border-emerald-500/50 transition-all duration-300">
              <div className="relative w-full aspect-[4/3] bg-[#0D111A] overflow-hidden">
                <img
                  alt="Institute of Trading Tricks Dedicated Trading Lab"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSl-eq7yrBOKEzBoYGPO0fUKn_xgKJRu9e9d31CDQr4aonU1moDZdFNSTGcX9QqehQ8KQzky1JGAaDBl29D3vFKJf_LhovcMXASjUHTQBdb_ReycIOux2NbhYpgm-DEFtjzt0j1AQ6zpugqz7X1OvxJkrk4o0QuE-kWCW4XKF06GBfDXvL4FJPVT9BKgctFOvByHbFK6MoeJWnzsi9R-TcYE9IfNlXQtQnyKKgmUg3u-0Cckzgd2qI0L3dzFqHELeaxA"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121722] via-transparent to-black/40" />
                <div className="absolute top-3 left-3 bg-[#121722]/95 backdrop-blur-md text-emerald-300 border border-emerald-500/40 font-mono text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Multi-Terminal Lab</span>
                </div>
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded">
                  <span>High-Speed Direct Terminal Lab</span>
                  <span className="text-emerald-400 font-semibold">Sub-5ms Execution</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow justify-between bg-[#121722]">
                <div>
                  <h3 className="text-lg text-white font-bold">
                    In-Person Trading Sessions &amp; Live Audits
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Multi-terminal trading floor equipped for London &amp; New York session executions with direct mentor supervision.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-mono font-semibold">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> Real Order Flow Execution
                  </span>
                  <span className="text-slate-400">Terminal 1–24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Prop Payouts */}
      <section className="w-full bg-[#05070B] py-20 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-2">
            <div>
              <div className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                PROMPT DISBURSEMENTS &amp; WIRE PROOF
              </div>
              <h2 className="text-2xl sm:text-3xl text-white font-extrabold tracking-tight">
                Recent Verified Prop Payouts
              </h2>
            </div>
            <div className="font-mono text-xs text-slate-400 flex items-center gap-2 bg-[#121722] px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Cryptographic Hash-Checked Live Payouts</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {payouts.map((item, idx) => (
              <div
                key={idx}
                className="relative bg-[#121722] p-5 rounded-xl border border-slate-800 shadow-xl hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono text-xs px-2.5 py-1 rounded font-bold border ${item.badgeClass}`}>
                    {item.firm}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">{item.certId}</span>
                </div>
                <div className="my-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Net Payout Disbursed
                  </div>
                  <div className="font-mono text-3xl font-extrabold text-emerald-400 tracking-tight drop-shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                    {item.amount}
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span>{item.flag}</span>
                    <span className="text-white font-semibold">{item.trader}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Student Reviews Grid */}
      <section className="w-full bg-[#080B11] py-20 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="px-4 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
              STUDENT TESTIMONIALS
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Real Operators. Real Capital.
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Read how students transitioned from inconsistent retail speculation to funded desk traders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studentReviews.map((review, i) => (
              <div
                key={i}
                className="bg-[#121722] p-6 rounded-2xl border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs font-semibold">
                      {review.badge}
                    </span>
                    <span className="font-mono text-xs text-emerald-400 font-bold">
                      {review.payout}
                    </span>
                  </div>
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(review.rating)].map((_, rIdx) => (
                      <Star key={rIdx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{review.name}</span>
                  <span className="text-slate-400 font-mono">{review.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-[#080B11] py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-[#0d1524] via-[#101c30] to-[#0d1524] p-8 sm:p-14 rounded-3xl border border-slate-800 border-t-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">
              BATCH 12 ENROLLMENT OPEN
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Ready to Become Our Next Verified Payout?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mb-8 leading-relaxed">
            Gain immediate lifetime access to the ITT Student LMS, 4K video modules, daily London/NY live desks, and physical campus access at Gul Arcade Plaza Islamabad.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center gap-2 bg-[#0d6938] hover:bg-[#09522b] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-[0_0_24px_rgba(13,105,56,0.45)] border border-emerald-400/40 transition-all"
            >
              <span>Enroll Now — $499</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#121722] hover:bg-[#182030] text-slate-300 hover:text-white px-6 py-3.5 rounded-xl font-semibold text-sm border border-slate-700 transition-all"
            >
              <span>Visit Islamabad Campus</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
