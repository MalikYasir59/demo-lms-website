import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PUBLIC_ASSETS } from "@/data/public-assets";

export const metadata: Metadata = {
  title: "About Us | Institute of Trading Tricks",
  description:
    "An Islamabad trading education institute run by the two mentors who teach in its classrooms, Adnan Rana and Talha Hanif.",
};

export default function AboutUsPage() {
  return (
    <div className="w-full">
      {/* =================================================================== */}
      {/* 1. PAGE HERO                                                        */}
      {/* =================================================================== */}
      <section className="hero-glow border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-4">
            <span className="w-5 h-px bg-[#D4C385]" />
            <span>ABOUT US</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white leading-[1.06] max-w-2xl mb-4">
            Built by traders, for the traders of tomorrow.
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
            An Islamabad institute run by the two mentors who teach in its classrooms.
          </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. MISSION TEXT + WIDE MENTORS BANNER + MEET YOUR MENTORS           */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* 2-Column Paragraphs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-slate-300 leading-relaxed mb-12">
            <p>
              The Institute of Trading Tricks is a Pakistani trading education institute based in Islamabad, committed to empowering individuals with the skills and confidence to succeed in the forex markets. We run structured, high-quality training programs — from beginner to advanced — covering everything from foundational market concepts to sophisticated strategies.
            </p>
            <p>
              Our mission is simple: trading success is not just about making profits, it is about building resilience, discipline and a growth mindset. We unlock each learner&apos;s potential and guide them toward long-term consistency and financial independence.
            </p>
          </div>

          {/* Wide Mentors Banner Image */}
          <div className="mb-14 border border-white/10 overflow-hidden bg-[#0A1026] shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PUBLIC_ASSETS.mentorsBanner}
              alt="Adnan Rana and Talha Hanif at Institute of Trading Tricks"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Meet your mentors */}
          <h2 className="font-display text-3xl text-white mb-6">Meet your mentors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
            {/* Adnan Rana Card */}
            <div className="card-surface p-6 flex items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PUBLIC_ASSETS.adnanRana}
                alt="Adnan Rana"
                className="w-20 h-20 rounded-full object-cover border border-white/15 shrink-0"
              />
              <div>
                <h3 className="font-display text-xl text-white leading-snug">Adnan Rana</h3>
                <div className="text-[10px] text-[#D4C385] mb-2 font-mono uppercase tracking-wider">
                  Head of the Institute
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Trading expert with an MBA in Finance and Marketing. Over a decade of experience in trading and finance, certified in Dubai, Baku and Thailand.
                </p>
              </div>
            </div>

            {/* Talha Hanif Card */}
            <div className="card-surface p-6 flex items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PUBLIC_ASSETS.talhaHanif}
                alt="Talha Hanif"
                className="w-20 h-20 rounded-full object-cover border border-white/15 shrink-0"
              />
              <div>
                <h3 className="font-display text-xl text-white leading-snug">Talha Hanif</h3>
                <div className="text-[10px] text-[#D4C385] mb-2 font-mono uppercase tracking-wider">
                  Managing Director
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  BBA-qualified trading expert with over a decade of experience in trading and finance, certified in Dubai, Baku and Thailand.
                </p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-500">
            Adnan Rana and Talha Hanif run the teaching floor at the institute.
          </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. THE CAMPUS & OPENING HOURS                                       */}
      {/* =================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left: The campus */}
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-white mb-5">The campus</h2>
            <div className="border border-white/10 overflow-hidden mb-3 bg-[#0A1026] shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PUBLIC_ASSETS.campus}
                alt="The campus trading floor"
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              3rd Floor, Gul Arcade Plaza, Opposite London Bakery, Main PWD Road, PWD Housing Society, Islamabad 44000
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Campus branches also operating in Wah Cantt and Attock.
            </p>
          </div>

          {/* Right: Opening hours */}
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-white mb-5">Opening hours</h2>
            <div className="card-surface divide-y divide-white/10 text-xs mb-5">
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-slate-400">Monday</span>
                <span className="text-slate-200">10:00 am – 8:00 pm</span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-slate-400">Tuesday</span>
                <span className="text-slate-200">10:00 am – 8:00 pm</span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-slate-400">Wednesday</span>
                <span className="text-slate-200">11:00 am – 8:00 pm</span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-slate-400">Thursday</span>
                <span className="text-slate-200">11:00 am – 9:00 pm</span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-slate-400">Friday</span>
                <span className="text-slate-200">11:00 am – 9:00 pm</span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-slate-400">Saturday</span>
                <span className="text-slate-200">11:00 am – 9:00 pm</span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-slate-400">Sunday</span>
                <span className="text-rose-400 font-medium">Closed</span>
              </div>
            </div>

            <Link
              href="/contact"
              className="bg-[#D4C385] hover:bg-[#E5D7A3] text-[#040714] font-semibold text-[10px] tracking-[0.18em] uppercase px-5 py-2.5 transition inline-block shadow-sm"
            >
              BOOK A VISIT
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
