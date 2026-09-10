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
        className="w-14 h-14 rounded-full bg-brand-emerald hover:bg-brand-emerald-hover text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group"
      >
        <Headset className="w-6 h-6 group-hover:rotate-6 transition-transform" />
      </Link>
    </div>
  );
}

