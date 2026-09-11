import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ShieldCheck, Scale, Award } from "lucide-react";
import { DESK_CONTACT_INFO } from "@/data/nav-links";

export const metadata: Metadata = {
  title: "Terms & Conditions of Service | Institute of Trading Tricks",
  description:
    "Institutional operational terms governing masterclass enrollment, platform usage, intellectual property, and high-risk trading disclaimers.",
};

export default function TermsConditionsPage() {
  return (
    <div className="w-full bg-[#080B11] text-[#E0E2EB]">
      {/* Page Header / Hero Banner */}
      <div className="relative w-full overflow-hidden bg-[#080B11] pt-16 pb-24 px-4 sm:px-6 lg:px-12 border-b border-white/[0.06] text-white terminal-grid">
        <div className="absolute top-0 right-0 w-[650px] h-[450px] bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[350px] bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08)_0%,transparent_55%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#121824] border border-white/[0.08] w-fit">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[#10B981] text-xs font-mono font-bold uppercase tracking-wider label-telemetry">
                Legal Governance
              </span>
              <span className="text-slate-600 text-xs">|</span>
              <span className="text-slate-400 text-xs font-mono tabular-nums">Effective Q4 2024</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Terms &amp; Conditions of Service
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed font-normal">
              These terms govern your enrollment in our educational courses, proprietary indicators, live desk telemetry, and prop firm preparation programs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="#risk"
              className="px-6 py-3 rounded bg-rose-600/90 text-white font-bold text-sm text-center hover:bg-rose-700 transition-colors shadow-md"
            >
              Risk Disclosure
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded bg-[#182234] hover:bg-[#1f2c42] text-[#E2E8F0] hover:text-white border border-white/[0.08] hover:border-[#6366F1]/40 font-semibold text-sm text-center transition-all"
            >
              Contact Legal Desk
            </Link>
          </div>
        </div>
      </div>

      {/* Main Legal Clauses */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-12">
        {/* Key Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121824]/90 backdrop-blur-xl p-6 rounded-lg border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] flex flex-col gap-3">
            <Scale className="w-6 h-6 text-[#10B981]" />
            <h3 className="font-bold text-white text-base">Educational Only</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              All courses, indicators, live webinars, and commentary are strictly educational and do not constitute financial advice.
            </p>
          </div>

          <div className="bg-[#121824]/90 backdrop-blur-xl p-6 rounded-lg border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] flex flex-col gap-3">
            <ShieldCheck className="w-6 h-6 text-[#10B981]" />
            <h3 className="font-bold text-white text-base">Proprietary IP</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Course videos, algorithms, indicator source codes, and Discord channels are protected intellectual property with zero sharing tolerance.
            </p>
          </div>

          <div className="bg-[#121824]/90 backdrop-blur-xl p-6 rounded-lg border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] flex flex-col gap-3">
            <Award className="w-6 h-6 text-[#10B981]" />
            <h3 className="font-bold text-white text-base">Retake Guarantee</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Elite &amp; Institutional members qualify for dedicated challenge retake coaching subject to compliance with documented risk parameters.
            </p>
          </div>
        </div>

        {/* Detailed Articles */}
        <div className="bg-[#121824]/95 backdrop-blur-xl p-8 sm:p-12 rounded-lg border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_20px_48px_-12px_rgba(0,0,0,0.75)] flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-white">1. Acceptance of Operational Agreement</h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              By accessing any service provided by the Institute of Trading Tricks, registering for an account, purchasing course access, or downloading algorithmic templates, you agree to be bound by these Terms and our Privacy &amp; Security Charter.
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-8">
            <h2 className="text-2xl font-bold text-white">2. Intellectual Property &amp; Non-Redistribution</h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              All educational recordings, quantitative spreadsheets, strategy templates, and live trade journals are the exclusive intellectual property of Institute of Trading Tricks. License to access is personal, non-transferable, and non-commercial. Any unauthorized redistribution, account sharing, or recording will result in immediate termination of access without refund and potential civil remedies.
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-8" id="risk">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-white">3. High-Risk Warning &amp; Disclosure</h2>
            </div>
            <div className="p-6 rounded bg-[#1e1015] border border-rose-900/50 text-xs sm:text-sm text-rose-200 leading-relaxed flex flex-col gap-3 font-mono">
              <p>
                <strong className="text-rose-400">REGULATORY RISK DISCLOSURE:</strong> Trading foreign exchange (Forex), contracts for difference (CFDs), futures, options, and cryptocurrencies carries a high level of market risk and can result in the loss of all deposited funds.
              </p>
              <p>
                The high degree of financial leverage available in derivatives can work against you as well as for you. Hypothetical or simulated performance results have certain limitations. Unlike an actual performance record, simulated results do not represent actual trading.
              </p>
              <p>
                The Institute of Trading Tricks is an educational publishing and analytics academy. We are not a registered broker-dealer, investment adviser, or commodity trading advisor (CTA). You alone assume the sole responsibility of evaluating the merits and risks associated with the use of any information.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-8">
            <h2 className="text-2xl font-bold text-white">4. Tuition, Refunds, &amp; Retake Safeguards</h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Due to the immediate digital delivery and proprietary nature of our course materials, standard enrollments carry a 14-day conditional evaluation window. If you have viewed fewer than 20% of the course modules and determine the curriculum is not aligned with your trading goals, you may request an audit for a refund.
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-8">
            <h2 className="text-2xl font-bold text-white">5. Governing Law &amp; Jurisdiction</h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of London, United Kingdom.
            </p>
            <div className="p-4 rounded bg-[#0B0F17] border border-white/[0.06] font-mono text-xs text-slate-300 flex flex-col gap-1 w-fit mt-2">
              <span>Legal Department // Institute of Trading Tricks</span>
              <span>{DESK_CONTACT_INFO.address}</span>
              <span className="text-[#10B981] font-bold">Email: legal@tradingtricks.institute</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
