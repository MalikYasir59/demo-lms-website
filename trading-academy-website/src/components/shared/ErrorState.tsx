"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error | string;
  onRetry?: () => void;
  homeHref?: string;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred while loading this view.",
  error,
  onRetry,
  homeHref,
  className,
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : null;

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-destructive/20 bg-destructive/5",
        className
      )}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4 border border-destructive/20 shadow-xs">
        <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-md leading-relaxed">
        {description}
      </p>

      {errorMessage && (
        <pre className="mt-3 p-3 rounded-xl bg-card border border-border text-[11px] font-mono text-destructive max-w-md w-full overflow-x-auto text-left">
          {errorMessage}
        </pre>
      )}

      <div className="mt-6 flex items-center gap-3">
        {onRetry && (
          <Button variant="primary" size="sm" onClick={onRetry} className="gap-2">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>
        )}
        {homeHref && (
          <Link href={homeHref}>
            <Button variant="secondary" size="sm" className="gap-2">
              <Home className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
