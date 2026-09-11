import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "emerald" | "amber" | "indigo" | "slate" | "blue" | "outline";
  pulse?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "slate",
  pulse = false,
  className,
}: BadgeProps) {
  const variantStyles = {
    // Profit / Live Audit Verified Badge: rgba(16, 185, 129, 0.10), text #10B981, border rgba(16, 185, 129, 0.30)
    emerald:
      "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]",
    // Institutional Tier / Sovereign Milestone: rgba(245, 158, 11, 0.10), text #F59E0B, border rgba(245, 158, 11, 0.30)
    amber:
      "bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]",
    // Primary / Execution Active State: rgba(99, 102, 241, 0.15), border #6366F1/40, text #c0c1ff
    indigo:
      "bg-[#6366F1]/15 border-[#6366F1]/35 text-[#c0c1ff]",
    blue:
      "bg-[#6366F1]/15 border-[#6366F1]/35 text-[#c0c1ff]",
    // Container Baseline
    slate:
      "bg-[#0B0F17] border-white/[0.08] text-[#94A3B8]",
    outline:
      "bg-transparent border-white/[0.12] text-slate-400",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono font-medium shadow-inner tracking-wider uppercase",
        variantStyles,
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
        </span>
      )}
      {children}
    </span>
  );
}
