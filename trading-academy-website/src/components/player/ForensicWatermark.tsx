"use client";

import React, { useEffect, useRef } from "react";

export interface WatermarkData {
  name: string;
  email: string;
  phone: string;
  code: string;
  ip: string;
}

interface ForensicWatermarkProps {
  data: WatermarkData;
  onTamperDetected?: () => void;
}

export default function ForensicWatermark({
  data,
  onTamperDetected,
}: ForensicWatermarkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let posX = 40;
    let posY = 60;
    let vx = 0.6;
    let vy = 0.4;

    const text = `${data.code} • ${data.name} • ${data.email} • ${data.ip}`;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Move watermark smoothly across the canvas
      posX += vx;
      posY += vy;

      if (posX <= 20 || posX >= Math.max(30, w - 320)) {
        vx = -vx;
      }
      if (posY <= 30 || posY >= Math.max(40, h - 30)) {
        vy = -vy;
      }

      ctx.save();
      ctx.font = "600 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
      ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Draw primary floating telemetry watermark
      ctx.fillText(text, posX, posY);

      // Draw secondary subtle watermark in opposite corner
      const secondaryX = (w - posX) % (w - 200);
      const secondaryY = (h - posY) % (h - 50);
      ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
      ctx.fillText(`${data.code} - ITT SECURE`, Math.max(20, secondaryX), Math.max(30, secondaryY));

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Anti-Tamper Observer: detects if canvas is removed, hidden, or modified
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          const style = window.getComputedStyle(canvas);
          if (
            style.display === "none" ||
            style.visibility === "hidden" ||
            parseFloat(style.opacity) < 0.1
          ) {
            onTamperDetected?.();
          }
        }
        if (mutation.type === "childList") {
          for (const removedNode of Array.from(mutation.removedNodes)) {
            if (removedNode === canvas) {
              onTamperDetected?.();
            }
          }
        }
      }
    });

    observer.observe(container, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["style", "class", "hidden"],
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [data, onTamperDetected]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
