"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PUBLIC_ASSETS } from "@/data/public-assets";

interface VideoItem {
  id: string;
  title: string;
  date: string;
  publishedDate: string;
  thumbnail: string;
}

const UPLOADS_LIST: VideoItem[] = [
  {
    id: "main",
    title: "Fundamental class happening live right now",
    date: "10 Apr 2026",
    publishedDate: "Published 10 Apr 2026",
    thumbnail: PUBLIC_ASSETS.videoMain,
  },
  {
    id: "dawn-expo",
    title: "Dawn Expo & student achievement highlights",
    date: "22 Nov 2025",
    publishedDate: "Published 22 Nov 2025",
    thumbnail: PUBLIC_ASSETS.thumbDawnExpo,
  },
  {
    id: "support-resistance",
    title: "Master Support & Resistance with Sir Talha",
    date: "13 Nov 2025",
    publishedDate: "Published 13 Nov 2025",
    thumbnail: PUBLIC_ASSETS.thumbSupport,
  },
  {
    id: "volume",
    title: "Volume trading in live market sessions",
    date: "10 Nov 2025",
    publishedDate: "Published 10 Nov 2025",
    thumbnail: PUBLIC_ASSETS.thumbVolume,
  },
  {
    id: "itt-tour",
    title: "Institute of Trading Tricks campus & desk overview",
    date: "9 Nov 2025",
    publishedDate: "Published 9 Nov 2025",
    thumbnail: PUBLIC_ASSETS.thumbItt,
  },
  {
    id: "pro-course",
    title: "Pro level course SMC & ICT framework preview",
    date: "8 Nov 2025",
    publishedDate: "Published 8 Nov 2025",
    thumbnail: PUBLIC_ASSETS.thumbPro,
  },
  {
    id: "advance-course",
    title: "Advance level course fundamentals & psychology",
    date: "7 Nov 2025",
    publishedDate: "Published 7 Nov 2025",
    thumbnail: PUBLIC_ASSETS.thumbAdvance,
  },
  {
    id: "inside-itt",
    title: "Inside the Institute of Trading Tricks live floor",
    date: "5 Nov 2025",
    publishedDate: "Published 5 Nov 2025",
    thumbnail: PUBLIC_ASSETS.thumbInside,
  },
];

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(UPLOADS_LIST[0]);

  return (
    <div className="w-full">
      {/* =================================================================== */}
      {/* 1. PAGE HERO                                                        */}
      {/* =================================================================== */}
      <section className="hero-glow border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-4">
            <span className="w-5 h-px bg-[#D4C385]" />
            <span>WATCH</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">Videos</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
            Lessons, live sessions and student stories from the Institute of Trading Tricks YouTube channel — 125 videos and counting.
          </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. FEATURED VIDEO + LATEST UPLOADS SIDEBAR                          */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Featured Video Player Area */}
            <div className="lg:col-span-7">
              <a
                href="https://www.youtube.com/results?search_query=Institute+of+Trading+Tricks+Islamabad"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-video bg-[#0A1026] border border-white/10 overflow-hidden mb-5 group cursor-pointer block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#D4C385] text-[#040714] flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                    </svg>
                  </div>
                </div>
              </a>

              <h2 className="font-display text-2xl sm:text-3xl text-white mb-1">
                {selectedVideo.title}
              </h2>
              <div className="text-[11px] text-slate-400 mb-5">
                {selectedVideo.publishedDate}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://www.youtube.com/results?search_query=Institute+of+Trading+Tricks+Islamabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#D4C385] hover:bg-[#E5D7A3] text-[#040714] font-semibold text-[10px] tracking-[0.18em] uppercase px-4 py-2.5 inline-flex items-center gap-2 transition"
                >
                  <span>WATCH ON YOUTUBE</span>
                  <span>→</span>
                </a>
                <a
                  href="https://www.youtube.com/results?search_query=Institute+of+Trading+Tricks+Islamabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/20 hover:border-[#D4C385] text-white text-[10px] tracking-[0.18em] uppercase px-4 py-2.5 transition"
                >
                  SUBSCRIBE
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[0.18em] uppercase text-slate-300 hover:text-[#D4C385] px-2 py-2 inline-flex items-center gap-1.5 transition"
                >
                  <span>◎</span>
                  <span>@INSTITUTEOFTRADINGTRICKS</span>
                </a>
              </div>
            </div>

            {/* Right: Latest Uploads Scrollable List */}
            <div className="lg:col-span-5 card-surface p-4">
              <div className="text-[10px] tracking-[0.2em] uppercase text-slate-400 px-2 pb-3 border-b border-white/10">
                LATEST UPLOADS
              </div>
              <div className="uploads-scroll max-h-[380px] overflow-y-auto divide-y divide-white/5 pr-1 mt-1">
                {UPLOADS_LIST.map((video) => {
                  const isSelected = selectedVideo.id === video.id;
                  return (
                    <button
                      key={video.id}
                      type="button"
                      onClick={() => setSelectedVideo(video)}
                      className={`video-item w-full flex items-center gap-3.5 p-2.5 hover:bg-white/5 text-left transition ${
                        isSelected ? "bg-white/[0.08]" : ""
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-16 h-11 object-cover shrink-0 border border-white/10"
                      />
                      <div>
                        <div
                          className={`text-xs font-medium line-clamp-2 transition ${
                            isSelected ? "text-[#D4C385]" : "text-white"
                          }`}
                        >
                          {video.title}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                          {video.date}
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

      {/* =================================================================== */}
      {/* 3. 125 VIDEOS ON THE CHANNEL                                        */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center justify-center w-9 h-7 border border-[#D4C385]/60 rounded text-[#D4C385] text-xs mb-4">
            ▶
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
            125 videos on the channel
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-3">
            We provide online and offline courses of Forex Trading, Digital Marketing, E-Commerce, Amazon Virtual Assistant and Graphic Designing.
          </p>
          <div className="text-[11px] text-slate-500 mb-6 font-mono">
            185 subscribers · 125 videos
          </div>
          <a
            href="https://www.youtube.com/results?search_query=Institute+of+Trading+Tricks+Islamabad"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#D4C385] hover:bg-[#E5D7A3] text-[#040714] font-semibold text-[10px] tracking-[0.2em] uppercase px-6 py-3 inline-flex items-center gap-2 transition"
          >
            <span>▷</span>
            <span>SEE ALL ON YOUTUBE</span>
          </a>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. GOLD BANNER CTA                                                  */}
      {/* =================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-[#D4C385] text-[#040714] px-6 py-12 sm:py-14 text-center gold-banner-shadow">
          <h2 className="font-display text-3xl sm:text-4xl text-[#040714] mb-2">
            See a class before you join one
          </h2>
          <p className="text-xs text-[#040714]/80 max-w-md mx-auto leading-relaxed mb-6">
            Ask us which batch fits you — we will tell you honestly whether to start at Basic.
          </p>
          <Link
            href="/contact"
            className="bg-[#1D4ED8] hover:bg-[#2563EB] text-white font-medium text-[10px] tracking-[0.2em] uppercase px-6 py-3 transition inline-block shadow-md"
          >
            TALK TO US
          </Link>
        </div>
      </section>
    </div>
  );
}
