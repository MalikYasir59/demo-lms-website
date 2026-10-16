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
  const variantStyles = {
    dark: "bg-card border border-border text-card-foreground shadow-lg",
    container:
      "bg-card/95 backdrop-blur-xl border border-border text-card-foreground shadow-xl",
    glass:
      "bg-card/85 backdrop-blur-2xl border border-border text-card-foreground shadow-2xl",
    raised:
      "bg-card border border-primary/25 text-card-foreground shadow-xl",
    light:
      "bg-muted border border-border text-card-foreground shadow-md",
    gradient:
      "bg-gradient-to-b from-card to-background border border-border text-card-foreground shadow-2xl",
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
