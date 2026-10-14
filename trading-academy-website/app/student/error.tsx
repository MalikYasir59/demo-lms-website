"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] mb-4 shadow-lg shadow-[#ef4444]/10">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h2 className="text-xl font-bold text-white tracking-tight mb-2">
        Unable to Load Course Module
      </h2>
      <p className="text-xs text-[#94a3b8] max-w-md mb-6 leading-relaxed">
        We encountered a temporary hiccup while connecting to your student portal.
        Please retry or return to your dashboard.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#6366f1]/25 hover:opacity-95 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <Link
          href="/student/dashboard"
          className="px-4 py-2.5 rounded-xl bg-[#121824] hover:bg-[#1e293b] text-white text-xs font-medium border border-[#1e293b] flex items-center gap-1.5 transition-colors"
        >
          <Home className="w-4 h-4 text-[#94a3b8]" />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
