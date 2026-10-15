import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "emerald" | "amber" | "indigo" | "slate" | "blue" | "outline" | "success" | "warning" | "destructive";
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
      "bg-success/10 border-success/30 text-success",
    success:
      "bg-success/10 border-success/30 text-success",
    amber:
      "bg-warning/10 border-warning/30 text-warning",
    warning:
      "bg-warning/10 border-warning/30 text-warning",
    indigo:
      "bg-primary/10 border-primary/30 text-primary",
    blue:
      "bg-primary/10 border-primary/30 text-primary",
    slate:
      "bg-muted border-border text-muted-foreground",
    outline:
      "bg-transparent border-border text-muted-foreground",
    destructive:
      "bg-destructive/10 border-destructive/30 text-destructive",
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
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
        </span>
      )}
      {children}
    </span>
  );
}
