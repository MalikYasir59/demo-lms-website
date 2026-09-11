import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark" | "alpha";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ href, variant = "primary", size = "md", children, className, ...props }, ref) => {
    // 4px corner radius per Obsidian Apex specification: rounded (0.25rem / 4px)
    const baseStyles =
      "inline-flex items-center justify-center font-bold tracking-tight transition-all rounded focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 focus:ring-offset-[#080B11] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3.5 text-base",
    }[size];

    const variantStyles = {
      // Primary Execution Button: Gradient fill #6366F1 to #4F46E5, white text, 1px border rgba(255,255,255,0.20), luminous aura
      primary:
        "bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white border border-white/20 shadow-[0_0_16px_rgba(99,102,241,0.40)] hover:shadow-[0_0_24px_rgba(99,102,241,0.65)] hover:-translate-y-0.5",
      // Secondary / Panel Button: Background #182234, text #E2E8F0, border 1px solid rgba(255,255,255,0.08), hover border rgba(99,102,241,0.40)
      secondary:
        "bg-[#182234] hover:bg-[#1f2c42] text-[#E2E8F0] hover:text-white border border-white/[0.08] hover:border-[#6366F1]/40",
      // Outline: Subtle glass border against Container Low #121824
      outline:
        "bg-[#121824]/60 hover:bg-[#121824] text-[#E2E8F0] hover:text-white border border-white/[0.12] hover:border-[#6366F1]/40",
      // Ghost Action: Background transparent, text #94A3B8, hover introduces background #121824 and text #FFFFFF
      ghost:
        "text-[#94A3B8] hover:text-white hover:bg-[#121824]",
      // Dark / Container Hull
      dark:
        "bg-[#0B0F17] border border-white/[0.08] text-[#E0E2EB] hover:border-white/20 hover:bg-[#121824]",
      // Alpha / Mint verification CTA
      alpha:
        "bg-[#10B981] hover:bg-[#059669] text-white border border-emerald-400/30 shadow-[0_0_16px_rgba(16,185,129,0.30)] hover:shadow-[0_0_20px_rgba(16,185,129,0.50)] hover:-translate-y-0.5",
    }[variant];

    const combinedClassName = cn(baseStyles, sizeStyles, variantStyles, className);

    if (href) {
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
