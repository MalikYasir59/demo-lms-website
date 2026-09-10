import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "dark" | "light" | "glass" | "gradient";
  className?: string;
  children: React.ReactNode;
}

export function Card({
  variant = "dark",
  className,
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    dark: "bg-brand-navy-card border border-slate-800 text-white shadow-xl",
    light: "bg-white border border-slate-200 text-slate-900 shadow-sm",
    glass: "bg-[#0b1220]/80 backdrop-blur-md border border-slate-800 text-white shadow-2xl",
    gradient: "bg-gradient-to-b from-[#0b1220] to-[#070b14] border border-slate-800 text-white shadow-2xl",
  }[variant];

  return (
    <div
      className={cn("rounded-xl transition-all", variantStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
}

