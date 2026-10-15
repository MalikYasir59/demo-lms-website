"use client";

import React, { useState } from "react";

interface AreaTrendChartProps {
  data: Array<{ date: string; value: number; label?: string }>;
  height?: number;
  color?: string; // e.g. '#6366f1'
  fillGradientId?: string;
  unit?: string;
  title?: string;
}

export function AreaTrendChart({
  data,
  height = 220,
  color = "#6366f1",
  fillGradientId = "areaGradient",
  unit = "",
  title,
}: AreaTrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center text-xs text-muted-foreground font-mono border border-dashed border-border rounded-xl"
        style={{ height }}
      >
        No activity recorded in this period
      </div>
    );
  }

  const padding = { top: 20, right: 20, bottom: 35, left: 40 };
  const width = 600; // viewBox width

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const minVal = 0;

  // Generate points
  const points = data.map((d, i) => {
    const x =
      padding.left +
      (i / Math.max(data.length - 1, 1)) * chartWidth;
    const y =
      padding.top +
      chartHeight -
      ((d.value - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, ...d };
  });

  // Construct smooth curve path
  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, "");

  // Area closed path for gradient fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${
    padding.top + chartHeight
  } L ${points[0].x} ${padding.top + chartHeight} Z`;

  // Y-axis ticks
  const yTicks = [0, Math.round(maxVal / 2), Math.round(maxVal)];

  return (
    <div className="w-full select-none">
      {title && (
        <div className="text-xs font-semibold text-muted-foreground mb-2 font-mono flex items-center justify-between">
          <span>{title}</span>
          {hoveredIdx !== null && (
            <span className="text-foreground font-mono text-[11px] bg-muted px-2 py-0.5 rounded border border-border">
              {data[hoveredIdx].date}:{" "}
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
        <defs>
          <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((tick, idx) => {
          const y =
            padding.top +
            chartHeight -
            ((tick - minVal) / (maxVal - minVal)) * chartHeight;
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="currentColor"
                className="text-border"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="text-[9px] fill-muted-foreground font-mono"
              >
                {tick}
                {unit}
              </text>
            </g>
          );
        })}

        {/* Gradient Area Fill */}
        <path d={areaD} fill={`url(#${fillGradientId})`} />

        {/* Stroke Curve Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive Points & X-Labels */}
        {points.map((pt, i) => {
          const isHovered = hoveredIdx === i;
          const showLabel =
            i === 0 ||
            i === Math.floor(points.length / 2) ||
            i === points.length - 1;

          return (
            <g key={i}>
              {/* Invisible large hover hit target */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="14"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />

              {/* Visible dot on hover */}
              {isHovered && (
                <>
                  <line
                    x1={pt.x}
                    y1={padding.top}
                    x2={pt.x}
                    y2={padding.top + chartHeight}
                    stroke="currentColor"
                    className="text-muted-foreground/60"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill={color}
                    stroke="currentColor"
                    className="text-background"
                    strokeWidth="2"
                  />
                </>
              )}

              {/* X-axis date labels */}
              {showLabel && (
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor={
                    i === 0
                      ? "start"
                      : i === points.length - 1
                      ? "end"
                      : "middle"
                  }
                  className="text-[10px] fill-muted-foreground font-mono"
                >
                  {pt.date.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
