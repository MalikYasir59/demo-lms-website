"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

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
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] mb-4 shadow-lg shadow-[#ef4444]/10">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h2 className="text-xl font-bold text-white tracking-tight mb-2">
        Console Operation Interrupted
      </h2>
      <p className="text-xs text-[#94a3b8] max-w-md mb-6 leading-relaxed">
        An unexpected error occurred while rendering the admin control view.
        {error.message && (
          <span className="block mt-2 font-mono text-[11px] text-[#ef4444] bg-[#ef4444]/10 px-3 py-1.5 rounded-lg border border-[#ef4444]/20">
            {error.message}
          </span>
        )}
      </p>

      <button
        onClick={() => reset()}
        className="px-4 py-2.5 rounded-xl bg-[#121824] hover:bg-[#1e293b] text-white text-xs font-semibold border border-[#1e293b] flex items-center gap-2 transition-colors shadow-lg"
      >
        <RefreshCw className="w-4 h-4 text-[#6366f1]" />
        <span>Retry Operation</span>
      </button>
    </div>
  );
}
