"use client";

import React from "react";
import Link from "next/link";
import { Headset } from "lucide-react";

export default function FloatingSupportButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/contact"
        aria-label="Contact Institutional Support Desk"
        className="w-13 h-13 rounded-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white shadow-[0_0_20px_rgba(99,102,241,0.50)] border border-white/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group"
      >
        <Headset className="w-6 h-6 group-hover:rotate-6 transition-transform" />
      </Link>
    </div>
  );
}
