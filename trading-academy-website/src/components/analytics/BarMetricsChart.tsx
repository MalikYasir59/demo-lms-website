"use client";

import React, { useState } from "react";

interface BarMetricsChartProps {
  data: Array<{ label: string; value: number; secondary?: string }>;
  height?: number;
  color?: string;
  unit?: string;
  title?: string;
}

export function BarMetricsChart({
  data,
  height = 220,
  color = "#10b981",
  unit = "",
  title,
}: BarMetricsChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center text-xs text-muted-foreground font-mono border border-dashed border-border rounded-xl"
        style={{ height }}
      >
        No comparative metrics available
      </div>
    );
  }

  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.min(48, Math.max(16, (chartWidth / data.length) * 0.65));
  const slotWidth = chartWidth / data.length;

  return (
    <div className="w-full select-none">
      {title && (
        <div className="text-xs font-semibold text-muted-foreground mb-2 font-mono flex items-center justify-between">
          <span>{title}</span>
          {hoveredIdx !== null && (
            <span className="text-foreground font-mono text-[11px] bg-muted px-2 py-0.5 rounded border border-border">
              {data[hoveredIdx].label}:{" "}
              <strong style={{ color }}>
                {data[hoveredIdx].value}
                {unit}
              </strong>
            </span>
          )}
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        style={{ height }}
      >
        {/* Baseline */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={width - padding.right}
          y2={padding.top + chartHeight}
          stroke="currentColor"
          className="text-border"
          strokeWidth="1"
        />

        {data.map((d, i) => {
          const barHeight = Math.max(
            4,
            (d.value / maxVal) * chartHeight
          );
          const x = padding.left + i * slotWidth + (slotWidth - barWidth) / 2;
          const y = padding.top + chartHeight - barHeight;
          const isHovered = hoveredIdx === i;

          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Background hover column */}
              {isHovered && (
                <rect
                  x={padding.left + i * slotWidth}
                  y={padding.top}
                  width={slotWidth}
                  height={chartHeight}
                  fill="currentColor"
                  className="text-muted"
                  opacity="0.6"
                  rx="4"
                />
              )}

              {/* Bar Rect */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                opacity={isHovered ? 1 : 0.85}
                rx="4"
                className="transition-all duration-150"
              />

              {/* Value label on top of bar */}
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className="text-[9px] font-mono fill-muted-foreground"
              >
                {d.value}
                {unit}
              </text>

              {/* X label */}
              <text
                x={x + barWidth / 2}
                y={height - 10}
                textAnchor="middle"
                className="text-[10px] font-mono fill-muted-foreground"
              >
                {d.label.length > 12 ? d.label.slice(0, 10) + ".." : d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
