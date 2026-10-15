"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Button } from "@/components/ui/Button";

export default function AdminConsoleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Console Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="mb-4">
        <BrandLogo size="md" variant="compact" />
      </div>

      <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/25 flex items-center justify-center text-destructive mb-4 shadow-sm">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h2 className="text-xl font-bold text-foreground tracking-tight mb-2">
        Console Operation Interrupted
      </h2>
      <p className="text-xs text-muted-foreground max-w-sm mb-4 leading-relaxed">
        An unexpected error occurred while rendering the admin control view.
      </p>

      {error.message && (
        <pre className="mb-6 font-mono text-[11px] text-destructive bg-destructive/10 px-3 py-2 rounded-xl border border-destructive/20 max-w-full overflow-x-auto text-left">
          {error.message}
        </pre>
      )}

      <div className="flex items-center gap-3">
        <Button variant="primary" size="sm" onClick={() => reset()} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>Retry Operation</span>
        </Button>

        <Link href="/admin/dashboard">
          <Button variant="secondary" size="sm" className="gap-2">
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
