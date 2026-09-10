import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AboutHero from "@/components/sections/about/AboutHero";
import PhilosophyValues from "@/components/sections/about/PhilosophyValues";
import TimelineMilestones from "@/components/sections/about/TimelineMilestones";
import TeamGrid from "@/components/sections/about/TeamGrid";
import AboutStatsRibbon from "@/components/sections/about/AboutStatsRibbon";

export const metadata: Metadata = {
  title: "About Us | Institute of Trading Tricks",
  description:
    "Discover the institutional heritage, prop desk traders, and quantitative philosophy behind the Institute of Trading Tricks.",
};

export default function AboutPage() {
  return (
    <div className="w-full bg-brand-navy">
      <AboutHero />
      <AboutStatsRibbon />
      <PhilosophyValues />
      <TimelineMilestones />
      <TeamGrid />

      {/* CTA Banner */}
      <section className="w-full bg-gradient-to-r from-[#070b14] via-[#0b1220] to-[#070b14] py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 text-white text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3.5 py-1 rounded">
            Take Action
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Trade with an Institutional Edge?
          </h2>
          <p className="text-slate-400 text-base max-w-xl">
            Join thousands of traders who have transitioned from erratic retail speculation to consistent, systematic prop-desk execution.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/courses/price-action-mastery#pricing"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-brand-emerald hover:bg-brand-emerald-hover text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
            >
              <span>Explore Masterclass</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors"
            >
              <span>Speak with Admissions</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

