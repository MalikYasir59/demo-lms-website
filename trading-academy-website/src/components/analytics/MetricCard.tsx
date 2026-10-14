"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number; // e.g. +12 or -5 percent
  icon: LucideIcon;
  iconColor?: string;
  badge?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  iconColor = "text-[#6366f1]",
  badge,
}: MetricCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-[#0b0f17] border border-[#1e293b] hover:border-[#334155] transition-all relative overflow-hidden group shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-[#64748b] uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`w-9 h-9 rounded-xl bg-[#121824] ${iconColor} flex items-center justify-center border border-[#1e293b] group-hover:scale-105 transition-transform`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
          {value}
        </div>
        {badge && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e293b] text-[#94a3b8] font-mono">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        {subtitle && <span className="text-[#94a3b8]">{subtitle}</span>}

        {change !== undefined && (
          <div
            className={`inline-flex items-center gap-1 font-mono text-[11px] font-medium ${
              change > 0
                ? "text-[#10b981]"
                : change < 0
                ? "text-[#ef4444]"
                : "text-[#64748b]"
            }`}
          >
            {change > 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : change < 0 ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            <span>{change > 0 ? `+${change}%` : `${change}%`}</span>
          </div>
        )}
      </div>
    </div>
  );
}
