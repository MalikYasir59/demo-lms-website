"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  FileText,
  Download,
  AlertCircle,
  Loader2,
  GraduationCap,
  Shield,
  BookOpen,
} from "lucide-react";
import HardenedPlayerShell from "@/components/player/HardenedPlayerShell";
import { toast } from "sonner";

export default function SecureLectureViewerPage() {
  const params = useParams();
  const router = useRouter();
  const lectureId = params.lectureId as string;

  const [streamData, setStreamData] = useState<{
    videoId: string;
    psid: string;
    watermark: any;
    resumeAt: number;
    durationSec: number;
    allowedRates: number[];
    allowSeekAhead: boolean;
  } | null>(null);

  const [streamError, setStreamError] = useState<string | null>(null);
  const [isInitializingStream, setIsInitializingStream] = useState(true);

  // Fetch Lecture Metadata & Navigation
  const { data: lectureData, isLoading: lectureLoading } = useQuery<{
    lecture: {
      _id: string;
      title: string;
      description?: string;
      durationSec: number;
      resources: { title: string; fileKey: string; size: number }[];
    };
    navigation: {
      prev: { id: string; title: string } | null;
      next: { id: string; title: string } | null;
    };
    progress: {
      lastPositionSec: number;
      percent: number;
      status: string;
    };
  }>({
    queryKey: ["student_lecture_data", lectureId],
    queryFn: async () => {
      const res = await fetch(`/api/student/lectures/${lectureId}`);
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message || "Failed to load lecture");
      }
      const json = await res.json();
      return json.data;
    },
  });

  // Flow: 1. Request Ticket -> 2. Redeem Ticket -> 3. Mount Hardened Player
  useEffect(() => {
    let isCancelled = false;

    async function initializeStream() {
      setIsInitializingStream(true);
      setStreamError(null);

      try {
        // Step 1: Request one-time ticket
        const ticketRes = await fetch("/api/student/playback/ticket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lectureId }),
        });

        const ticketJson = await ticketRes.json();
        if (!ticketRes.ok) {
          throw new Error(ticketJson.error?.message || "Failed to obtain playback authorization");
        }

        const ticketData = ticketJson.data;

        // Step 2: Redeem ticket for decrypted video ID
        const redeemRes = await fetch("/api/student/playback/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticket: ticketData.ticket,
            nonce: Math.random().toString(36).substring(2),
          }),
        });

        const redeemJson = await redeemRes.json();
        if (!redeemRes.ok) {
          throw new Error(redeemJson.error?.message || "Playback ticket redemption failed");
        }

        if (!isCancelled) {
          setStreamData({
            videoId: redeemJson.data.p.vid,
            psid: redeemJson.data.psid,
            watermark: ticketData.wm,
            resumeAt: ticketData.resumeAt,
            durationSec: ticketData.durationSec,
            allowedRates: ticketData.rates,
            allowSeekAhead: ticketData.allowSeekAhead,
          });
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : "Playback initialization error";
          setStreamError(msg);
        }
      } finally {
        if (!isCancelled) {
          setIsInitializingStream(false);
        }
      }
    }

    initializeStream();

    return () => {
      isCancelled = true;
    };
  }, [lectureId]);

  if (lectureLoading || isInitializingStream) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#10b981]" />
        <h2 className="text-base font-bold text-white tracking-tight">
          Authorizing Playback Stream
        </h2>
        <p className="text-xs text-[#64748b] font-mono">
          Verifying enrollment ticket & initialising forensic watermark...
        </p>
      </div>
    );
  }

  if (streamError) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-[#0b0f17] border border-red-500/30 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Playback Unauthorized</h2>
        <p className="text-xs text-[#94a3b8] leading-relaxed">{streamError}</p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#121824] border border-[#1e293b] text-xs font-semibold text-white hover:border-[#6366f1]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Syllabus</span>
        </button>
      </div>
    );
  }

  const { lecture, navigation, progress } = lectureData!;
  const isCompleted = progress.status === "completed";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Syllabus</span>
        </button>

        <div className="flex items-center gap-2">
          {navigation.prev && (
            <Link
              href={`/student/learn/${navigation.prev.id}`}
              className="px-3 py-1.5 rounded-xl bg-[#121824] border border-[#1e293b] text-xs font-semibold text-[#94a3b8] hover:text-white hover:border-[#6366f1] flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Previous</span>
            </Link>
          )}

          {navigation.next && (
            <Link
              href={`/student/learn/${navigation.next.id}`}
              className="px-3 py-1.5 rounded-xl bg-[#6366f1] text-white text-xs font-semibold hover:bg-[#4f46e5] flex items-center gap-1 transition-colors shadow-md shadow-[#6366f1]/20"
            >
              <span className="hidden sm:inline">Next Lesson</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Main Video Player Shell */}
      {streamData && (
        <HardenedPlayerShell
          videoId={streamData.videoId}
          psid={streamData.psid}
          lectureId={lectureId}
          watermark={streamData.watermark}
          initialResumeAt={streamData.resumeAt}
          durationSec={streamData.durationSec}
          allowedRates={streamData.allowedRates}
          allowSeekAhead={streamData.allowSeekAhead}
          onLectureCompleted={() => {
            toast.success("Lecture Completed! Great progress.");
          }}
          onSessionTerminated={(reason) => {
            toast.error(reason);
          }}
        />
      )}

      {/* Lecture Title & Completion Status Header */}
      <div className="p-6 rounded-3xl bg-[#0b0f17] border border-[#1e293b] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 text-[10px] font-mono font-semibold">
              LESSON
            </span>
            {isCompleted ? (
              <span className="flex items-center gap-1 text-[#10b981] text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Threshold Reached (Completed)</span>
              </span>
            ) : (
              <span className="text-xs text-[#64748b] font-mono">
                {progress.percent}% Unique Seconds Watched
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {lecture.title}
          </h1>
        </div>

        {navigation.next && (
          <Link
            href={`/student/learn/${navigation.next.id}`}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white text-xs font-semibold hover:opacity-95 transition-all shadow-md shadow-[#6366f1]/20 flex items-center gap-1.5 self-start md:self-auto shrink-0"
          >
            <span>Continue Next</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Lecture Notes & Resource Downloads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notes */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-[#0b0f17] border border-[#1e293b] space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#6366f1]" />
            <span>Lesson Notes & Key Takeaways</span>
          </h2>
          <p className="text-xs text-[#94a3b8] leading-relaxed whitespace-pre-wrap">
            {lecture.description || "No specific lesson notes provided for this video."}
          </p>
        </div>

        {/* Attachments / Downloads */}
        <div className="p-6 rounded-3xl bg-[#0b0f17] border border-[#1e293b] space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#10b981]" />
            <span>Lesson Resources</span>
          </h2>

          {!lecture.resources || lecture.resources.length === 0 ? (
            <div className="text-xs text-[#64748b]">
              No downloadable attachments for this lesson.
            </div>
          ) : (
            <div className="space-y-2">
              {lecture.resources.map((res, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#121824] border border-[#1e293b] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate">
                    <div className="font-semibold text-white truncate">{res.title}</div>
                    <div className="text-[10px] text-[#64748b] font-mono">
                      {(res.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <button
                    onClick={() => toast.info("Resource download initiated")}
                    className="p-2 rounded-lg bg-[#6366f1]/15 text-[#6366f1] hover:bg-[#6366f1] hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
