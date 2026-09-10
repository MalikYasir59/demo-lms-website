import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, FileText, CheckCircle2 } from "lucide-react";
import { DESK_CONTACT_INFO } from "@/data/nav-links";

export const metadata: Metadata = {
  title: "Privacy & Security Charter | Institute of Trading Tricks",
  description:
    "Institutional-grade telemetry encryption, data sovereignty, and compliance standards at the Institute of Trading Tricks.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-brand-surface text-slate-800">
      {/* Page Header / Hero Banner (Deep Dark Navy) */}
      <div className="relative w-full overflow-hidden bg-brand-navy pt-16 pb-24 px-4 sm:px-6 lg:px-12 border-b border-slate-800 text-white terminal-grid">
        <div className="absolute top-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 w-fit">
              <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
              <span className="text-brand-emerald text-xs font-mono font-bold uppercase tracking-wider">
                Legal Framework
              </span>
              <span className="text-slate-500 text-xs">|</span>
              <span className="text-slate-400 text-xs font-mono">Updated Q4 2024</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Privacy &amp; Security Charter
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
              The Institute of Trading Tricks maintains institutional-grade telemetry protection. Explore our uncompromising standards on data sovereignty, encryption protocols, and regulatory compliance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/contact?subject=dpo"
              className="px-6 py-3 rounded-lg bg-brand-emerald text-white font-bold text-sm text-center hover:bg-brand-emerald-hover transition-colors shadow-md"
            >
              Contact DPO Desk
            </Link>
            <Link
              href="#framework"
              className="px-6 py-3 rounded-lg bg-slate-900 text-slate-200 border border-slate-700 font-semibold text-sm text-center hover:bg-slate-800 transition-colors"
            >
              Read Framework
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-12" id="framework">
        {/* Section 1: Security Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
            <Shield className="w-6 h-6 text-brand-emerald" />
            <h3 className="font-bold text-slate-900 text-base">256-Bit TLS Encryption</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All communications and terminal authentication tokens are encrypted in transit and at rest using bank-grade AES-256 standards.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
            <Lock className="w-6 h-6 text-brand-emerald" />
            <h3 className="font-bold text-slate-900 text-base">Zero Data Monetization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never sell, rent, or monetize student telemetry, trading journals, or contact information to third-party brokers or advertisers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
            <FileText className="w-6 h-6 text-brand-emerald" />
            <h3 className="font-bold text-slate-900 text-base">GDPR &amp; CCPA Compliant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full data subject rights including data portability, right to erasure, and automated telemetry opt-outs upon written request.
            </p>
          </div>
        </div>

        {/* Section 2: Detailed Clauses */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-slate-900">1. Information Collection &amp; Telemetry Scope</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When you enroll in our masterclass, access the trading terminal portal, or contact our admissions desk, we collect relevant identity and technical telemetry to deliver our educational and analytical services.
            </p>
            <ul className="flex flex-col gap-2 pt-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <span><strong>Identity Data:</strong> Full name, verified email address, phone number, and billing location.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <span><strong>Educational Telemetry:</strong> Course progression, quiz completions, and video playback milestones.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <span><strong>Session Logs:</strong> IP address, browser user-agent, operating system, and secure session tokens.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900">2. Processing Lawfulness &amp; Purpose</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We process personal data solely on legitimate operational grounds: fulfillment of service delivery, prevention of platform abuse, verification of prop firm challenge prep outcomes, and regulatory compliance under UK/EU data sovereignty laws.
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900">3. Retention &amp; Erasure Schedules</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Student account records and credentials are maintained for the duration of lifetime masterclass access. Financial transaction logs are archived in accordance with statutory accounting obligations (typically 7 years). Users may request complete erasure of optional trading journal data at any time by notifying the DPO.
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold text-slate-900">4. Contacting the Data Protection Officer (DPO)</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              For any inquiries regarding data sovereignty, access requests, or privacy audits, contact our designated Data Protection Officer directly:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 flex flex-col gap-1 w-fit">
              <span>Attention: Data Protection Officer</span>
              <span>Institute of Trading Tricks</span>
              <span>{DESK_CONTACT_INFO.address}</span>
              <span className="text-brand-emerald font-bold">Email: dpo@tradingtricks.institute</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

