import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomeHero from "@/components/sections/home/HomeHero";
import OrderFlowStats from "@/components/sections/home/OrderFlowStats";
import TerminalFeatures from "@/components/sections/home/TerminalFeatures";
import CourseShowcase from "@/components/sections/home/CourseShowcase";
import TestimonialsRibbon from "@/components/sections/home/TestimonialsRibbon";

export const metadata: Metadata = {
  title: "Institute of Trading Tricks | Institutional Trading Academy",
  description:
    "Master price action, quantitative market structure, and algorithmic order flow. Proprietary floor strategies engineered for funded prop firm evaluations.",
};

export default function HomePage() {
  return (
    <div className="w-full bg-brand-navy">
      <HomeHero />
      <OrderFlowStats />
      <TerminalFeatures />
      <CourseShowcase />
      <TestimonialsRibbon />

      {/* Bottom Enrollment CTA */}
      <section className="w-full bg-gradient-to-b from-[#070b14] to-[#04070c] py-24 px-4 sm:px-6 lg:px-8 text-white text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-4 py-1.5 rounded-full">
            INSTITUTIONAL ENROLLMENT OPEN
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Stop Trading Retail Noise. Start Trading Institutional Order Flow.
          </h2>

          <p className="text-slate-400 text-base max-w-xl">
            Join 2,800+ active funded traders who master the exact liquidity models used on institutional trading floors.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/courses/price-action-mastery"
              className="px-8 py-4 rounded-xl bg-brand-emerald hover:bg-brand-emerald-hover text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2"
            >
              <span>Enroll in Masterclass</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors"
            >
              <span>Contact Desk Admissions</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

