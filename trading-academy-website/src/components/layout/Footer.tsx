import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#080B11] border-t border-white/[0.08] text-slate-400 relative overflow-hidden">
      {/* Subtle Background Trading Floor Overlay Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-luminosity bg-cover bg-center"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCBaP-_8G7HwJ7Li8EoBd4ySTdrsxzjKgqTLPOFPwEMDvSuCilizLBY325p7IN1-Ln3BmMfQ6XcOWF3Ps9iwIikBYqLCMSQO6wTQAHzeTP85bBErqxMdok5jpm8_Vpa4UN0ku2FqcQYgzbmE36_COYQGWRyFceyXJXMM8Y14KhgR4ObrxSf5-TeYq-JZ4G_x9eRAWIZP77h8e1LCEX8gyM3tS8ve0yvr43H4uTz8VE3cULIVfo6tVKXjCIULSTdRQ6atg')`,
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#080B11]/90 via-[#080B11] to-[#080B11]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                alt="Institute of Trading Tricks Logo"
                className="h-10 w-10 rounded-full object-cover border border-emerald-400/40 bg-[#080b11]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIstu7bUQiSYWSLNEqTuW-jvuhqjD6OdPKpZ1aNFwsznv4SMhi5j8KEUwmuD0HSOV716Rn-JMsdH2aJjBtOpnZMmpjgEdaW85YIiaf9pK1RlcySg0Hp6c59FBOPiOqiTUIv74PgojjXKLkqodECUzGfp51dJx83uHGjSwqucA6smAa_793IaYxnTHdPhQGuS_5LQ5EkrPmDGbk_f8NxMwtClWz9j0Tw_P3mWYGiotRoo216VgZD167HkV6x5avV0coyw"
              />
              <span className="text-base font-bold text-white">
                Institute of <span className="text-emerald-400">Trading Tricks</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Institutional execution protocol, proprietary Learning Management System, and physical trading floors engineered for autonomous funded traders.
            </p>
            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
              <span className="material-symbols-outlined text-emerald-400 text-base flex-shrink-0">
                location_on
              </span>
              <span>3rd Floor Gul Arcade Plaza, PWD Road, Islamabad</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ISLAMABAD PHYSICAL FLOOR ACTIVE</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-xs uppercase text-white font-bold tracking-wider mb-1">
              Quick Links
            </span>
            <Link className="text-xs text-slate-400 hover:text-emerald-400 transition-colors" href="/">
              Home Overview
            </Link>
            <Link className="text-xs text-slate-400 hover:text-emerald-400 transition-colors" href="/courses">
              Courses &amp; Curriculum
            </Link>
            <Link className="text-xs text-slate-400 hover:text-emerald-400 transition-colors" href="/#lms-portal">
              Student LMS Portal
            </Link>
            <Link className="text-xs text-slate-400 hover:text-emerald-400 transition-colors" href="/#campus">
              Campus &amp; Seminars
            </Link>
            <Link className="text-xs text-slate-400 hover:text-emerald-400 transition-colors" href="/testimonials">
              Client &amp; Testimonials
            </Link>
            <Link className="text-xs text-slate-400 hover:text-emerald-400 transition-colors" href="/#pricing">
              Batch 12 Enrollment ($499)
            </Link>
          </div>

          {/* Curriculum Modules Column */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase text-white font-bold tracking-wider mb-1">
              Curriculum Modules
            </span>
            <span className="text-xs text-slate-400">
              <span className="text-emerald-400 font-mono font-semibold">MOD 01:</span> Market Microstructure &amp; Liquidity
            </span>
            <span className="text-xs text-slate-400">
              <span className="text-emerald-400 font-mono font-semibold">MOD 02:</span> Order Flow &amp; Fair Value Gaps
            </span>
            <span className="text-xs text-slate-400">
              <span className="text-emerald-400 font-mono font-semibold">MOD 03:</span> Risk Geometry &amp; Sizing Matrix
            </span>
            <span className="text-xs text-slate-400">
              <span className="text-emerald-400 font-mono font-semibold">MOD 04:</span> Prop Firm Evaluation Blueprints
            </span>
            <span className="text-xs text-slate-400">
              <span className="text-emerald-400 font-mono font-semibold">MOD 05:</span> Execution Desk Audio Streams
            </span>
            <span className="text-xs text-slate-400">
              <span className="text-emerald-400 font-mono font-semibold">MOD 06:</span> Trader Psychology &amp; Tilt Control
            </span>
          </div>

          {/* Compliance & Support Column */}
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-xs uppercase text-white font-bold tracking-wider mb-1">
              Compliance &amp; Support
            </span>
            <Link className="text-xs text-slate-400 hover:text-emerald-400 transition-colors" href="/terms-conditions">
              Risk Disclosure Notice
            </Link>
            <Link className="text-xs text-slate-400 hover:text-emerald-400 transition-colors" href="/terms-conditions">
              Terms of Participation
            </Link>
            <Link className="text-xs text-slate-400 hover:text-emerald-400 transition-colors" href="/privacy-policy">
              Privacy Protocol
            </Link>
            <Link className="text-xs text-slate-400 hover:text-emerald-400 transition-colors" href="/contact">
              Direct Desk Contact
            </Link>
            <div className="mt-2 p-2.5 rounded-lg bg-[#121722] border border-white/[0.06]">
              <div className="font-mono text-[10px] text-emerald-400 font-bold uppercase mb-0.5">
                ENCRYPTION PROTOCOL
              </div>
              <p className="text-[11px] text-slate-400">
                256-Bit SSL Checkout &amp; Direct Private Terminal Access.
              </p>
            </div>
          </div>
        </div>

        {/* Risk Disclaimer Notice */}
        <div className="p-4 rounded-xl bg-[#121722] mb-8 border border-white/[0.06]">
          <p className="font-mono text-[11px] text-slate-400 text-center leading-relaxed uppercase">
            Disclaimer: Financial trading contains substantial risk of loss and is not suitable for all investors. Institute of Trading Tricks provides financial educational training and software simulator access. Past performance and simulated test results are not necessarily indicative of future results.
          </p>
        </div>

        {/* Telemetry Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left pt-4 border-t border-white/[0.06]">
          <p className="text-xs text-slate-400 font-mono">
            © 2026 Institute of Trading Tricks. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="font-mono text-xs text-slate-400">
              LMS PORTAL RELEASE: <span className="text-emerald-400 font-bold">v4.20-SECURE</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
