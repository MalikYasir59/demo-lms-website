"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BrandLogoProps {
  variant?: "full" | "compact";
  size?: "sm" | "md" | "lg";
  subtitle?: string;
  href?: string;
  className?: string;
}

export function BrandLogo({
  variant = "full",
  size = "md",
  subtitle,
  href,
  className,
}: BrandLogoProps) {
  const sizeMap = {
    sm: {
      box: "w-7 h-7 rounded-lg",
      dim: 28,
      title: "text-xs font-bold leading-tight",
      subtitle: "text-[9px]",
    },
    md: {
      box: "w-9 h-9 rounded-xl",
      dim: 36,
      title: "text-sm font-bold leading-tight",
      subtitle: "text-[10px]",
    },
    lg: {
      box: "w-12 h-12 rounded-2xl",
      dim: 48,
      title: "text-base font-bold leading-tight",
      subtitle: "text-xs",
    },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      <div
        className={cn(
          "relative overflow-hidden border border-border/80 bg-[#080d1a] shadow-xs shrink-0 flex items-center justify-center transition-transform group-hover:scale-102",
          currentSize.box
        )}
      >
        <Image
          src="/images/Logoitt.jpg"
          alt="Institute of Trading Tricks logo"
          width={currentSize.dim}
          height={currentSize.dim}
          className="object-cover w-full h-full"
          priority
        />
      </div>

      {variant === "full" && (
        <div className="flex flex-col min-w-0">
          <span className={cn("text-foreground font-semibold tracking-tight truncate", currentSize.title)}>
            Institute of Trading Tricks
          </span>
          {subtitle && (
            <span
              className={cn(
                "text-muted-foreground font-mono uppercase tracking-wider font-medium truncate",
                currentSize.subtitle
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
