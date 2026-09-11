import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "dark" | "glass" | "container" | "raised" | "light" | "gradient";
  className?: string;
  children: React.ReactNode;
}

export function Card({
  variant = "dark",
  className,
  children,
  ...props
}: CardProps) {
  // Shape: rounded-lg (8px) per Obsidian Apex specification
  const variantStyles = {
    // Floor 1: Baseline Panel
    dark: "bg-[#0B0F17]/90 backdrop-blur-md border border-white/[0.06] text-white shadow-xl shadow-black/40",
    // Floor 2: Container Low Floating Card with Inset Top Highlight
    container:
      "bg-[#121824]/95 backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] text-white shadow-xl shadow-black/50",
    glass:
      "bg-[#121824]/85 backdrop-blur-2xl border border-white/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-white shadow-2xl",
    // Floor 3: Raised Interactive Panel with ambient execution shadow
    raised:
      "bg-[#182234] border border-[#6366F1]/25 text-white shadow-[0_20px_48px_-12px_rgba(0,0,0,0.75),0_0_24px_0_rgba(99,102,241,0.15)]",
    // Backwards compatible aliases mapped to dark Obsidian Apex floors
    light:
      "bg-[#121824] border border-white/[0.08] text-white shadow-md",
    gradient:
      "bg-gradient-to-b from-[#182234] to-[#0B0F17] border border-white/[0.08] text-white shadow-2xl",
  }[variant];

  return (
    <div
      className={cn("rounded-lg transition-all", variantStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
}
