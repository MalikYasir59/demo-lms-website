import React from "react";
import Link from "next/link";
import { TrendingUp, Globe, Share2, MessageSquare } from "lucide-react";
import {
  FOOTER_COMPANY_LINKS,
  FOOTER_TRADING_LINKS,
  DESK_CONTACT_INFO,
} from "@/data/nav-links";

export default function Footer() {
  return (
    <footer className="w-full bg-[#070B14] text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-brand-royal text-white flex items-center justify-center shadow-md">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight group-hover:text-emerald-400 transition-colors">
                Trading Tricks
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering retail and institutional traders with advanced quantitative methodologies, algorithmic order flow telemetry, and elite market psychology.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-1">
              <a
                href="#"
                aria-label="Global Network"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 hover:text-emerald-400 transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Community Share"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 hover:text-emerald-400 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href={DESK_CONTACT_INFO.discordHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord Desk"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 hover:text-emerald-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-3">
            <span className="font-mono font-bold uppercase tracking-wider text-white text-xs">
              Company
            </span>
            {FOOTER_COMPANY_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-emerald-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Trading Links Column */}
          <div className="flex flex-col gap-3">
            <span className="font-mono font-bold uppercase tracking-wider text-white text-xs">
              Trading Links
            </span>
            {FOOTER_TRADING_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-emerald-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact Desk Column */}
          <div className="flex flex-col gap-3">
            <span className="font-mono font-bold uppercase tracking-wider text-white text-xs">
              Contact Desk
            </span>
            <span className="text-slate-300 leading-snug">
              {DESK_CONTACT_INFO.address}
            </span>
            <a
              href={`mailto:${DESK_CONTACT_INFO.email}`}
              className="hover:text-emerald-400 transition-colors font-mono"
            >
              {DESK_CONTACT_INFO.email}
            </a>
            <a
              href="tel:+18005558742"
              className="hover:text-emerald-400 transition-colors font-mono"
            >
              {DESK_CONTACT_INFO.phone}
            </a>
            <span className="text-slate-500 font-mono text-[11px] pt-1">
              Hours: {DESK_CONTACT_INFO.hours}
            </span>
          </div>
        </div>

        {/* Risk Disclosure and Legal */}
        <div className="pt-8 border-t border-slate-800 flex flex-col gap-6 text-[11px] text-slate-500 font-mono">
          <p className="leading-relaxed text-justify opacity-80">
            <span className="uppercase font-bold text-slate-400">Risk Disclosure:</span>{" "}
            Trading foreign exchange, cryptocurrencies, equities, and derivative contracts carries a high level of risk and may not be suitable for all investors. High leverage can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial capital. Past performance is not indicative of future market results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 pt-4 border-t border-slate-800/60">
            <p>© {new Date().getFullYear()} Institute of Trading Tricks. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:text-slate-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

