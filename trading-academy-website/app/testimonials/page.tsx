import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TestimonialsHero from "@/components/sections/testimonials/TestimonialsHero";
import StatRibbon from "@/components/sections/testimonials/StatRibbon";
import FeaturedVideoCase from "@/components/sections/testimonials/FeaturedVideoCase";
import TestimonialsGrid from "@/components/sections/testimonials/TestimonialsGrid";

export const metadata: Metadata = {
  title: "Client & Trader Testimonials | Institute of Trading Tricks",
  description:
    "Explore verified student results, prop firm challenge pass rates, and trader testimonials from the Institute of Trading Tricks.",
};

export default function TestimonialsPage() {
  return (
    <div className="w-full bg-brand-navy">
      {/* Hero with Stat Ribbon */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pt-16 pb-16 relative overflow-hidden bg-brand-navy text-white terminal-grid border-b border-slate-800">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
          <TestimonialsHero />
          <StatRibbon />
        </div>
      </section>

      {/* Featured Video Breakdown */}
      <FeaturedVideoCase />

      {/* Filterable Testimonials Wall */}
      <TestimonialsGrid />

      {/* Bottom CTA Strip */}
      <section className="w-full bg-gradient-to-r from-[#070b14] via-[#0b1220] to-[#070b14] py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 text-white text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Become Our Next Verified Success Story?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Enroll today in our flagship Price Action &amp; Market Structure Masterclass.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/courses/price-action-mastery#pricing"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-brand-emerald hover:bg-brand-emerald-hover text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors"
            >
              <span>Talk to an Advisor</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

