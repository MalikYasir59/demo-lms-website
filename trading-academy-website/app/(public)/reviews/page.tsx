import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import VideoReviewsSection from "@/components/sections/public/VideoReviewsSection";

export const metadata: Metadata = {
  title: "Student Reviews | Institute of Trading Tricks",
  description:
    "222 verified Google reviews with 4.8 out of 5 stars from students who have completed practical forex training at our Islamabad campus.",
};

const REVIEWS_DATA = [
  {
    quote:
      "Alhamdulillah my trading course has been completed. I learned Forex trading from the institute and now I'm making very good trades and generating solid profits. Highly recommended.",
    date: "15 JAN 2026",
  },
  {
    quote:
      "I especially liked their teaching style — clear, patient and practical. The environment feels comfortable, and they make learning Forex enjoyable instead of stressful.",
    date: "22 NOV 2025",
  },
  {
    quote:
      "I had a great experience with the Institute of Trading Tricks. The team is very friendly, supportive and always ready to help. Their Forex trading lessons are easy to understand, even for beginners, and they explain every concept with real examples.",
    date: "22 NOV 2025",
  },
  {
    quote:
      "Great trading institute! The instructors explain concepts clearly, from basics to advanced strategies. The environment is supportive, and I gained real confidence in my trading. Highly recommended for beginners and intermediate traders. Thanks sir Adnan and sir Talha.",
    date: "22 NOV 2025",
  },
  {
    quote:
      "I appreciate the Institute of Trading Tricks — truly the best institute for anyone who wants to master Forex trading. If you want real knowledge, real skills and real guidance, then this is the place you must join. Here you don't just learn charts, you understand the market.",
    date: "16 NOV 2025",
  },
  {
    quote:
      "I had a great experience with the instructors! They're extremely cooperative, experienced and knowledgeable in their field. Their guidance and support made a huge difference in my learning journey. Highly recommended!",
    date: "24 AUG 2025",
  },
  {
    quote:
      "Institute of Trading Tricks offers an excellent trading course with knowledgeable instructors and practical training. The curriculum is well-structured, covering all essential aspects of trading with clarity. Highly recommended for anyone looking to enhance their trading skills!",
    date: "28 DEC 2024",
  },
];

export default function ReviewsPage() {
  return (
    <div className="w-full">
      {/* =================================================================== */}
      {/* 1. PAGE HERO                                                        */}
      {/* =================================================================== */}
      <section className="hero-glow border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-4">
            <span className="w-5 h-px bg-[#D4C385]" />
            <span>REVIEWS</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">
            What students say
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
            Every word below is a review left on Google. Google shows them without a name, so each one is dated instead.
          </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. 4.8 RATING SUMMARY STRIP                                         */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="font-display text-5xl text-[#D4C385] leading-none mb-2">4.8</div>
          <div className="text-[#D4C385] text-sm tracking-widest mb-2">★★★★★</div>
          <p className="text-xs text-slate-400 mb-5">
            222 Google reviews from students who have traded through our batches.
          </p>
          <a
            href="https://www.google.com/maps/search/Institute+of+Trading+Tricks+Islamabad"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/20 hover:border-[#D4C385] text-white text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 inline-flex items-center gap-2 transition"
          >
            <span>READ THEM ON GOOGLE</span>
            <span>→</span>
          </a>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. STUDENT VIDEO TESTIMONIALS (REAL MP4 REVIEWS)                   */}
      {/* =================================================================== */}
      <VideoReviewsSection />

      {/* =================================================================== */}
      {/* 4. 7 VERIFIED GOOGLE REVIEW CARDS + GOLD BANNER CTA                 */}
      {/* =================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {REVIEWS_DATA.map((rev, idx) => (
            <div key={idx} className="card-surface p-6 flex flex-col justify-between">
              <div>
                <div className="text-[#D4C385] font-display text-2xl leading-none mb-3">❞</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  {rev.quote}
                </p>
              </div>
              <div className="flex items-center justify-between text-[9px] tracking-[0.16em] uppercase text-slate-500 pt-4 border-t border-white/5">
                <span>VERIFIED GOOGLE REVIEW</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Gold Banner CTA: Trained with us? Add your review */}
        <div className="bg-[#D4C385] text-[#040714] px-6 py-12 sm:py-14 text-center gold-banner-shadow">
          <h2 className="font-display text-3xl sm:text-4xl text-[#040714] mb-2">
            Trained with us? Add your review
          </h2>
          <p className="text-xs text-[#040714]/80 max-w-md mx-auto leading-relaxed mb-6">
            Send us a few lines on WhatsApp and we will add them here — or leave them directly on Google.
          </p>
          <div className="flex items-center justify-center gap-6 text-[10px] tracking-[0.2em] uppercase font-semibold">
            <a
              href="https://wa.me/923077330777"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#040714] hover:underline"
            >
              SEND YOURS
            </a>
            <Link href="/contact" className="text-[#040714] hover:underline">
              VISIT THE CAMPUS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
