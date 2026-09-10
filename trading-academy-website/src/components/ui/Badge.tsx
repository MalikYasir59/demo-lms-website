import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "emerald" | "blue" | "slate" | "amber" | "outline";
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
    emerald:
      "bg-emerald-950/70 border-emerald-800 text-emerald-400",
    blue:
      "bg-[#1E40AF]/20 border-[#1E40AF]/40 text-blue-400",
    slate:
      "bg-slate-800/90 border-slate-700 text-slate-300",
    amber:
      "bg-amber-950/60 border-amber-800 text-amber-400",
    outline:
      "bg-transparent border-slate-700 text-slate-400",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-medium shadow-inner",
        variantStyles,
        className
      )}
    >
      {pulse && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
      {children}
    </span>
  );
}

