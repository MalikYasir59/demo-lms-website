import React from "react";
import { Loader2 } from "lucide-react";

export default function StudentLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-[#94a3b8] space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-[#6366f1]" />
      <span className="text-xs font-mono tracking-wider uppercase text-[#64748b]">
        Loading Academy Content...
      </span>
    </div>
  );
}
