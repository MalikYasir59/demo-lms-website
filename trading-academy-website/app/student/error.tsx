"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Button } from "@/components/ui/Button";

export default function StudentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Student Portal Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="mb-4">
        <BrandLogo size="md" variant="compact" />
      </div>

      <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/25 flex items-center justify-center text-destructive mb-4 shadow-sm">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h2 className="text-xl font-bold text-foreground tracking-tight mb-2">
        Unable to Load Course Module
      </h2>
      <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
        We encountered a temporary interruption while connecting to your student portal.
        Please retry or return to your dashboard.
      </p>

      <div className="flex items-center gap-3">
        <Button variant="primary" size="sm" onClick={() => reset()} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>

        <Link href="/student/dashboard">
          <Button variant="secondary" size="sm" className="gap-2">
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
