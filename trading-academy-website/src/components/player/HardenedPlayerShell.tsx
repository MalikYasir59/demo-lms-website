"use client";

import React, { useEffect, useRef, useState, useCallback, useId } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Shield,
  Lock,
  Loader2,
} from "lucide-react";
import ForensicWatermark, { WatermarkData } from "./ForensicWatermark";

interface HardenedPlayerShellProps {
  videoId: string;
  psid: string;
  lectureId: string;
  watermark: WatermarkData;
  initialResumeAt?: number;
  durationSec?: number;
  allowedRates?: number[];
  allowSeekAhead?: boolean;
  onLectureCompleted?: () => void;
  onSessionTerminated?: (reason: string) => void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export default function HardenedPlayerShell({
  videoId,
  psid,
  lectureId,
  watermark,
  initialResumeAt = 0,
  durationSec = 0,
  allowedRates = [0.75, 1, 1.25, 1.5, 2],
  allowSeekAhead = true,
  onLectureCompleted,
  onSessionTerminated,
}: HardenedPlayerShellProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const reactId = useId();
  const playerId = `itt-yt-${reactId.replace(/:/g, "")}`;

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialResumeAt);
  const [duration, setDuration] = useState(durationSec || 1);
  const [maxPositionReached, setMaxPositionReached] = useState(initialResumeAt);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Security & protection states
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [isSecurityLocked, setIsSecurityLocked] = useState(false);
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);

  // Last heartbeat position tracker
  const lastHeartbeatPos = useRef(initialResumeAt);

  // Report client security event
  const reportEvent = useCallback(
    async (type: string, meta: Record<string, unknown> = {}) => {
      try {
        const res = await fetch("/api/student/security/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, lectureId, meta }),
        });
        const json = await res.json();
        if (json.data?.action === "pause") {
          playerRef.current?.pauseVideo();
        } else if (json.data?.action === "lock") {
          playerRef.current?.pauseVideo();
          setIsSecurityLocked(true);
          setSecurityMessage("Stream locked due to anti-tamper security trigger.");
        }
      } catch {
        // Suppress network error during security report
      }
    },
    [lectureId]
  );

  // 1. YouTube IFrame API Loader & Player Initialization
  useEffect(() => {
    let isCancelled = false;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      playerRef.current = new window.YT.Player(playerId, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: typeof window !== "undefined" ? window.location.origin : "",
        },
        events: {
          onReady: (e: any) => {
            if (isCancelled) return;
            setIsReady(true);
            const d = e.target.getDuration();
            if (d && d > 0) setDuration(d);
            if (initialResumeAt > 0) {
              e.target.seekTo(initialResumeAt, true);
            }
          },
          onStateChange: (e: any) => {
            if (isCancelled) return;
            // YT.PlayerState: 1 = PLAYING, 2 = PAUSED, 0 = ENDED
            if (e.data === 1) {
              setIsPlaying(true);
            } else if (e.data === 2) {
              setIsPlaying(false);
            } else if (e.data === 0) {
              setIsPlaying(false);
              onLectureCompleted?.();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.getElementById("youtube-iframe-api");
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.id = "youtube-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = () => {
        if (!isCancelled) initPlayer();
      };
    }

    return () => {
      isCancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {}
    };
  }, [videoId, initialResumeAt, onLectureCompleted, playerId]);

  // 2. Playback Position & Seek-Ahead Polling Loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
        const time = playerRef.current.getCurrentTime() || 0;
        setCurrentTime(time);
        setMaxPositionReached((prev) => Math.max(prev, time));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // 3. Telemetry Heartbeat (every 15s per spec 7.5)
  useEffect(() => {
    if (!isPlaying || isSecurityLocked) return;

    const sendHeartbeat = async () => {
      const currentPos = playerRef.current?.getCurrentTime() || currentTime;
      const fromPos = lastHeartbeatPos.current;
      lastHeartbeatPos.current = currentPos;

      try {
        const res = await fetch("/api/student/playback/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            psid,
            lectureId,
            from: fromPos,
            pos: currentPos,
            rate: playbackRate,
            state: "playing",
          }),
        });

        const json = await res.json();
        if (json.data?.terminate) {
          playerRef.current?.pauseVideo();
          setIsPlaying(false);
          setIsSecurityLocked(true);
          const reason = json.data.terminate.message || "Playback terminated by server policy";
          setSecurityMessage(reason);
          onSessionTerminated?.(reason);
        }
      } catch {
        // Network resilience: heartbeat will retry in next interval
      }
    };

    const interval = setInterval(sendHeartbeat, 15000);
    return () => clearInterval(interval);
  }, [
    isPlaying,
    isSecurityLocked,
    psid,
    lectureId,
    playbackRate,
    currentTime,
    onSessionTerminated,
  ]);

  // 4. Anti-Piracy Defense: Keyboard Shortcut & Devtools Guard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S
      const isDevKey =
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.metaKey && e.altKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && ["U", "S", "P"].includes(e.key.toUpperCase())) ||
        (e.metaKey && ["U", "S", "P"].includes(e.key.toUpperCase())) ||
        e.key === "PrintScreen";

      if (isDevKey) {
        e.preventDefault();
        e.stopPropagation();
        reportEvent("shortcut_blocked", { key: e.key });
      }
    };

    // Window blur & visibility change protection
    const handleBlur = () => {
      setIsWindowBlurred(true);
      playerRef.current?.pauseVideo();
      reportEvent("blur_lock", { reason: "window_blur" });
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        setIsWindowBlurred(true);
        playerRef.current?.pauseVideo();
        reportEvent("blur_lock", { reason: "tab_hidden" });
      } else {
        setIsWindowBlurred(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reportEvent]);

  // Controls handlers
  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    // Strict seek-ahead enforcement per spec 4.3.3
    if (!allowSeekAhead && target > maxPositionReached + 5) {
      reportEvent("seek_ahead_blocked", { target, max: maxPositionReached });
      return;
    }
    setCurrentTime(target);
    playerRef.current?.seekTo(target, true);
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    playerRef.current?.setPlaybackRate(rate);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    setVolume(v);
    playerRef.current?.setVolume(v);
    if (v === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden select-none border border-[#1e293b] shadow-2xl group"
    >
      {/* 1. Underlying YouTube Iframe Container */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div id={playerId} className="w-full h-full" />
      </div>

      {/* 2. Transparent Interactive Guard Shield */}
      <div
        onClick={togglePlay}
        className="absolute inset-0 z-20 cursor-pointer bg-transparent"
      />

      {/* 3. Forensic Moving Canvas Watermark Layer */}
      <ForensicWatermark
        data={watermark}
        onTamperDetected={() => {
          playerRef.current?.pauseVideo();
          setIsSecurityLocked(true);
          setSecurityMessage("Watermark tamper detected. Session locked for security.");
          reportEvent("tamper_detected");
        }}
      />

      {/* 4. Window Blur / Privacy Blackout Overlay */}
      {isWindowBlurred && !isSecurityLocked && (
        <div className="absolute inset-0 z-40 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 space-y-3">
          <Shield className="w-10 h-10 text-[#6366f1] animate-pulse" />
          <h3 className="text-base font-bold text-white">Playback Temporarily Suspended</h3>
          <p className="text-xs text-[#94a3b8] max-w-sm">
            Please return focus to this browser tab to resume your lesson. Anti-recording blur protection is active.
          </p>
        </div>
      )}

      {/* 5. Security Termination / Lockout Overlay */}
      {isSecurityLocked && (
        <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 border border-destructive/25 flex items-center justify-center text-destructive">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Playback Session Locked</h3>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            {securityMessage || "Your stream has been locked by institutional security policy."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-semibold hover:border-primary/50 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-primary" />
            <span>Reload Stream</span>
          </button>
        </div>
      )}

      {/* 6. Big Center Play Button Overlay (when paused) */}
      {!isPlaying && isReady && !isSecurityLocked && !isWindowBlurred && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-[#10b981] text-black flex items-center justify-center shadow-2xl shadow-[#10b981]/40 scale-100 hover:scale-110 transition-transform">
            <Play className="w-7 h-7 fill-black ml-1" />
          </div>
        </div>
      )}

      {/* 7. Loading Indicator */}
      {!isReady && !isSecurityLocked && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80">
          <div className="text-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#10b981] mx-auto" />
            <div className="text-xs text-[#94a3b8] font-mono">Decrypting video stream...</div>
          </div>
        </div>
      )}

      {/* 8. Hardened Bottom Control Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Scrub Bar */}
        <div className="relative mb-3 group/scrub">
          <input
            type="range"
            min={0}
            max={duration}
            step={0.5}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-[#334155] rounded-full appearance-none cursor-pointer accent-[#10b981]"
          />
          {!allowSeekAhead && (
            <div
              className="absolute top-0 bottom-0 right-0 bg-red-500/20 pointer-events-none rounded-r-full"
              style={{
                left: `${Math.min(100, (maxPositionReached / duration) * 100)}%`,
              }}
              title="Seek-ahead locked until watched"
            />
          )}
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={handleVolume}
                className="w-16 h-1 bg-[#334155] rounded-full accent-[#10b981] cursor-pointer"
              />
            </div>

            <div className="font-mono text-[11px] text-[#94a3b8]">
              <span className="text-white">{formatTime(currentTime)}</span>
              <span> / </span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Selector */}
            <div className="flex items-center gap-1 font-mono text-[11px]">
              {allowedRates.map((r) => (
                <button
                  key={r}
                  onClick={() => handleRateChange(r)}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    playbackRate === r
                      ? "bg-[#10b981] text-black font-bold"
                      : "text-[#94a3b8] hover:text-white"
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>

            {/* Forensic watermark indicator */}
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-[#10b981] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/15 border border-[#10b981]/30">
              <Shield className="w-3 h-3" />
              <span>ITT-SECURE</span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
