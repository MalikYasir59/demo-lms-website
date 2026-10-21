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
  videoSrc: string;
  duration?: string;
  category: "Class" | "Review" | "Strategy";
}

const UPLOADS_LIST: VideoItem[] = [
  {
    id: "short-breakdown",
    title: "1-Minute Practical Market Analysis & Trade Breakdown",
    date: "10 Apr 2026",
    publishedDate: "Published 10 Apr 2026",
    thumbnail: PUBLIC_ASSETS.videoMain,
    videoSrc: PUBLIC_ASSETS.videos.shortBreakdown,
    duration: "1:00",
    category: "Strategy",
  },
  {
    id: "mentorship-session",
    title: "Live Trading Floor Session & Interactive Mentorship",
    date: "28 Mar 2026",
    publishedDate: "Published 28 Mar 2026",
    thumbnail: PUBLIC_ASSETS.thumbSupport,
    videoSrc: PUBLIC_ASSETS.videos.mentorshipFloor,
    duration: "1:30",
    category: "Class",
  },
  {
    id: "market-psychology",
    title: "Advanced Forex Market Strategy & Risk Psychology",
    date: "14 Mar 2026",
    publishedDate: "Published 14 Mar 2026",
    thumbnail: PUBLIC_ASSETS.thumbVolume,
    videoSrc: PUBLIC_ASSETS.videos.psychologySession,
    duration: "2:15",
    category: "Strategy",
  },
  {
    id: "delivery-review-1",
    title: "Student Review & Feedback — ITT Practical Batch 1",
    date: "22 Feb 2026",
    publishedDate: "Published 22 Feb 2026",
    thumbnail: PUBLIC_ASSETS.thumbDawnExpo,
    videoSrc: PUBLIC_ASSETS.videos.deliveryReview1,
    duration: "1:15",
    category: "Review",
  },
  {
    id: "delivery-review-2",
    title: "Student Review & Feedback — ITT Practical Batch 2",
    date: "15 Feb 2026",
    publishedDate: "Published 15 Feb 2026",
    thumbnail: PUBLIC_ASSETS.videoCert,
    videoSrc: PUBLIC_ASSETS.videos.deliveryReview2,
    duration: "0:55",
    category: "Review",
  },
  {
    id: "delivery-review-3",
    title: "Student Review & Feedback — ITT Practical Batch 3",
    date: "04 Feb 2026",
    publishedDate: "Published 04 Feb 2026",
    thumbnail: PUBLIC_ASSETS.videoClass,
    videoSrc: PUBLIC_ASSETS.videos.deliveryReview3,
    duration: "1:40",
    category: "Review",
  },
  {
    id: "delivery-review-4",
    title: "Student Review & Feedback — ITT Practical Batch 4",
    date: "20 Jan 2026",
    publishedDate: "Published 20 Jan 2026",
    thumbnail: PUBLIC_ASSETS.thumbItt,
    videoSrc: PUBLIC_ASSETS.videos.deliveryReview4,
    duration: "1:10",
    category: "Review",
  },
  {
    id: "delivery-review-5",
    title: "Student Review & Feedback — ITT Practical Batch 5",
    date: "11 Jan 2026",
    publishedDate: "Published 11 Jan 2026",
    thumbnail: PUBLIC_ASSETS.thumbPro,
    videoSrc: PUBLIC_ASSETS.videos.deliveryReview5,
    duration: "2:20",
    category: "Review",
  },
  {
    id: "delivery-review-6",
    title: "Student Review & Feedback — ITT Practical Batch 6",
    date: "28 Dec 2025",
    publishedDate: "Published 28 Dec 2025",
    thumbnail: PUBLIC_ASSETS.thumbAdvance,
    videoSrc: PUBLIC_ASSETS.videos.deliveryReview6,
    duration: "1:55",
    category: "Review",
  },
  {
    id: "delivery-review-7",
    title: "Student Review & Feedback — ITT Practical Batch 7",
    date: "18 Dec 2025",
    publishedDate: "Published 18 Dec 2025",
    thumbnail: PUBLIC_ASSETS.thumbInside,
    videoSrc: PUBLIC_ASSETS.videos.deliveryReview7,
    duration: "3:30",
    category: "Review",
  },
  {
    id: "delivery-review-8",
    title: "Student Review & Feedback — ITT Practical Batch 8",
    date: "05 Dec 2025",
    publishedDate: "Published 05 Dec 2025",
    thumbnail: "/images/Final (74).JPG",
    videoSrc: PUBLIC_ASSETS.videos.deliveryReview8,
    duration: "1:35",
    category: "Review",
  },
];

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(UPLOADS_LIST[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  return (
    <div className="w-full">
      {/* =================================================================== */}
      {/* 1. PAGE HERO                                                        */}
      {/* =================================================================== */}
      <section className="hero-glow border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-4">
            <span className="w-5 h-px bg-[#D4C385]" />
            <span>WATCH VIDEOS</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">Videos</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
            Lessons, live floor trading sessions, and authentic student reviews from the Institute of Trading Tricks Islamabad campus.
          </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. FEATURED VIDEO PLAYER + LATEST UPLOADS SIDEBAR                   */}
      {/* =================================================================== */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Featured Video Player Area */}
            <div className="lg:col-span-7">
              <div className="relative aspect-video bg-[#040714] border border-white/10 overflow-hidden mb-5 rounded-sm shadow-2xl">
                <video
                  key={selectedVideo.videoSrc}
                  src={selectedVideo.videoSrc}
                  poster={selectedVideo.thumbnail}
                  controls
                  playsInline
                  autoPlay={isPlaying}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#D4C385]/15 text-[#D4C385] font-medium">
                  {selectedVideo.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedVideo.publishedDate}
                </span>
                {selectedVideo.duration && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    · {selectedVideo.duration}
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl sm:text-3xl text-white mb-4">
                {selectedVideo.title}
              </h2>

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
              <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-slate-400 px-2 pb-3 border-b border-white/10">
                <span>SELECT VIDEO TO PLAY</span>
                <span className="text-slate-500 font-mono">{UPLOADS_LIST.length} VIDEOS</span>
              </div>
              <div className="uploads-scroll max-h-[460px] overflow-y-auto divide-y divide-white/5 pr-1 mt-1">
                {UPLOADS_LIST.map((video) => {
                  const isSelected = selectedVideo.id === video.id;
                  return (
                    <button
                      key={video.id}
                      type="button"
                      onClick={() => handleSelectVideo(video)}
                      className={`video-item w-full flex items-center gap-3.5 p-2.5 hover:bg-white/5 text-left transition ${
                        isSelected ? "bg-white/[0.08]" : ""
                      }`}
                    >
                      <div className="relative w-20 h-14 shrink-0 overflow-hidden border border-white/10 bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] pl-0.5 ${
                            isSelected ? "bg-[#D4C385] text-[#040714]" : "bg-white/70 text-[#040714]"
                          }`}>
                            ▶
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-xs font-medium line-clamp-2 transition ${
                            isSelected ? "text-[#D4C385]" : "text-white"
                          }`}
                        >
                          {video.title}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1 font-mono">
                          <span>{video.date}</span>
                          <span>·</span>
                          <span className="text-[#D4C385]/80">{video.category}</span>
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
            Practical Videos On Demand
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-3">
            We provide physical and live mentorship in Forex Trading, Smart Money Concepts (SMC), Price Action, Risk Management and Trading Psychology.
          </p>
          <div className="text-[11px] text-slate-500 mb-6 font-mono">
            Islamabad Campus · PWD Sector
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
            Ask us which batch fits you — we will tell you honestly whether to start at Basic or Advanced.
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
