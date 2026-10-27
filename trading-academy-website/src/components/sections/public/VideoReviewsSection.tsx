"use client";

import React, { useState } from "react";
import { PUBLIC_ASSETS } from "@/data/public-assets";

interface VideoReview {
  id: number;
  title: string;
  batch: string;
  src: string;
  poster: string;
}

const VIDEO_REVIEWS: VideoReview[] = [
  {
    id: 1,
    title: "Batch Delivery 1 — Live Trading Feedback",
    batch: "Forex Batch 1",
    src: PUBLIC_ASSETS.videos.deliveryReview1,
    poster: PUBLIC_ASSETS.videoMain,
  },
  {
    id: 2,
    title: "Batch Delivery 2 — Practical Execution",
    batch: "Forex Batch 2",
    src: PUBLIC_ASSETS.videos.deliveryReview2,
    poster: PUBLIC_ASSETS.videoCert,
  },
  {
    id: 3,
    title: "Batch Delivery 3 — Risk Management & Psychology",
    batch: "Forex Batch 3",
    src: PUBLIC_ASSETS.videos.deliveryReview3,
    poster: PUBLIC_ASSETS.videoClass,
  },
  {
    id: 4,
    title: "Batch Delivery 4 — SMC & ICT Analysis",
    batch: "Forex Batch 4",
    src: PUBLIC_ASSETS.videos.deliveryReview4,
    poster: PUBLIC_ASSETS.thumbDawnExpo,
  },
  {
    id: 5,
    title: "Batch Delivery 5 — Real Market Sessions",
    batch: "Forex Batch 5",
    src: PUBLIC_ASSETS.videos.deliveryReview5,
    poster: PUBLIC_ASSETS.thumbSupport,
  },
  {
    id: 6,
    title: "Batch Delivery 6 — Floor Trading Confidence",
    batch: "Forex Batch 6",
    src: PUBLIC_ASSETS.videos.deliveryReview6,
    poster: PUBLIC_ASSETS.thumbVolume,
  },
  {
    id: 7,
    title: "Batch Delivery 7 — Consistent Trading Journey",
    batch: "Forex Batch 7",
    src: PUBLIC_ASSETS.videos.deliveryReview7,
    poster: PUBLIC_ASSETS.thumbPro,
  },
  {
    id: 8,
    title: "Batch Delivery 8 — Mentorship Experience",
    batch: "Forex Batch 8",
    src: PUBLIC_ASSETS.videos.deliveryReview8,
    poster: PUBLIC_ASSETS.thumbInside,
  },
];

export default function VideoReviewsSection() {
  const [activeReview, setActiveReview] = useState<VideoReview>(VIDEO_REVIEWS[0]);

  return (
    <section className="border-b border-white/10 bg-[#030611] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-3">
              <span className="w-5 h-px bg-[#D4C385]" />
              <span>STUDENT VIDEO TESTIMONIALS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-white">
              Watch what our graduates say
            </h2>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            {VIDEO_REVIEWS.length} VERIFIED VIDEO REVIEWS
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Active Video Player */}
          <div className="lg:col-span-8">
            <div className="aspect-video bg-[#040714] border border-white/10 rounded-sm overflow-hidden shadow-2xl relative">
              <video
                key={activeReview.src}
                src={activeReview.src}
                poster={activeReview.poster}
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#D4C385] font-mono mr-2">
                  {activeReview.batch}
                </span>
                <h3 className="font-display text-xl text-white inline-block">
                  {activeReview.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Quick Select Sidebar of Reviews */}
          <div className="lg:col-span-4 card-surface p-4">
            <div className="text-[10px] tracking-[0.2em] uppercase text-slate-400 px-2 pb-3 border-b border-white/10">
              ALL VIDEO TESTIMONIALS
            </div>
            <div className="uploads-scroll max-h-[380px] overflow-y-auto divide-y divide-white/5 pr-1 mt-1">
              {VIDEO_REVIEWS.map((review) => {
                const isSelected = activeReview.id === review.id;
                return (
                  <button
                    key={review.id}
                    type="button"
                    onClick={() => setActiveReview(review)}
                    className={`w-full flex items-center gap-3 p-2.5 text-left transition hover:bg-white/5 ${
                      isSelected ? "bg-white/[0.08]" : ""
                    }`}
                  >
                    <div className="relative w-16 h-11 shrink-0 overflow-hidden border border-white/10 bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={review.poster}
                        alt={review.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[7px] pl-0.5 ${
                          isSelected ? "bg-[#D4C385] text-[#040714]" : "bg-white/70 text-[#040714]"
                        }`}>
                          ▶
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-xs font-medium line-clamp-1 transition ${
                          isSelected ? "text-[#D4C385]" : "text-white"
                        }`}
                      >
                        {review.title}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        {review.batch}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
