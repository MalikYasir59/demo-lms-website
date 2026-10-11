"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TestimonialsVideoSliderProps = {
  videos: string[];
};

export default function TestimonialsVideoSlider({
  videos,
}: TestimonialsVideoSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (index !== activeIndex) video?.pause();
    });
  }, [activeIndex, videos.length]);

  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + videos.length) % videos.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a1320] px-4 py-8 sm:px-8 sm:py-10">
      <div className="relative mx-auto h-[min(72vw,440px)] min-h-[250px] max-w-5xl">
        {videos.map((src, index) => {
          const offset =
            ((index - activeIndex + videos.length + Math.floor(videos.length / 2)) %
              videos.length) -
            Math.floor(videos.length / 2);
          const isActive = offset === 0;

          return (
            <div
              key={src}
              aria-hidden={!isActive}
              className="absolute left-1/2 top-1/2 w-[min(78vw,680px)] overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0c1420] shadow-[0_0_30px_rgba(0,0,0,0.35)] transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none md:w-[min(58vw,680px)]"
              style={{
                transform: `translate(calc(-50% + ${offset * 60}%), -50%) scale(${isActive ? 1 : 0.86})`,
                opacity: isActive ? 1 : Math.abs(offset) === 1 ? 0.7 : 0,
                zIndex: videos.length - Math.abs(offset),
                pointerEvents: isActive ? "auto" : "none",
                visibility: Math.abs(offset) <= 1 ? "visible" : "hidden",
              }}
            >
              <div className="aspect-video overflow-hidden bg-black">
                <video
                  ref={(element) => {
                    videoRefs.current[index] = element;
                  }}
                  src={src}
                  controls={isActive}
                  playsInline
                  muted={!isActive}
                  preload={Math.abs(offset) <= 1 ? "metadata" : "none"}
                  tabIndex={isActive ? 0 : -1}
                  className="h-full w-full object-cover transition-[filter,transform] duration-500"
                  style={{
                    filter: isActive ? "none" : "blur(4px)",
                    transform: isActive ? "scale(1)" : "scale(1.06)",
                  }}
                />
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.08] bg-[#0d1623] px-4 py-3">
                <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-300">
                  Review {index + 1}
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-400">
                  {String(index + 1).padStart(2, "0")} / {String(videos.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => move(-1)}
        aria-label="Previous review video"
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-[#070d15]/90 p-2 text-white shadow-lg transition hover:border-emerald-400/60 hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 sm:left-5"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        aria-label="Next review video"
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-[#070d15]/90 p-2 text-white shadow-lg transition hover:border-emerald-400/60 hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 sm:right-5"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
