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
  iconColor = "text-primary",
  badge,
}: MetricCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-card text-card-foreground border border-border hover:border-primary/40 transition-all relative overflow-hidden group shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`w-9 h-9 rounded-xl bg-muted ${iconColor} flex items-center justify-center border border-border group-hover:scale-105 transition-transform`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono">
          {value}
        </div>
        {badge && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        {subtitle && <span className="text-muted-foreground">{subtitle}</span>}

        {change !== undefined && (
          <div
            className={`inline-flex items-center gap-1 font-mono text-[11px] font-medium ${
              change > 0
                ? "text-success"
                : change < 0
                ? "text-destructive"
                : "text-muted-foreground"
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
