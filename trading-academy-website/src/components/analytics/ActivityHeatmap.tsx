"use client";

import React, { useState } from "react";

interface ActivityHeatmapProps {
  data: Array<{ day: number; hour: number; count: number }>;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    day: number;
    hour: number;
    count: number;
  } | null>(null);

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const getCellColor = (count: number) => {
    if (count === 0) return "bg-[#121824]";
    const ratio = count / maxCount;
    if (ratio < 0.25) return "bg-[#6366f1]/25";
    if (ratio < 0.5) return "bg-[#6366f1]/50";
    if (ratio < 0.75) return "bg-[#6366f1]/75";
    return "bg-[#6366f1]";
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-[#94a3b8]">24-Hour Weekly Heatmap (UTC)</span>
        {hoveredCell ? (
          <span className="text-white bg-[#1e293b] px-2.5 py-0.5 rounded text-[11px]">
            {DAYS[hoveredCell.day]} at {String(hoveredCell.hour).padStart(2, "0")}:00 —{" "}
            <strong className="text-[#6366f1]">{hoveredCell.count} sessions</strong>
          </span>
        ) : (
          <span className="text-[#64748b]">Hover over a cell to view peak traffic</span>
        )}
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[640px] space-y-1.5">
          {/* Hour labels */}
          <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 text-[9px] text-[#64748b] font-mono text-center">
            <span />
            {Array.from({ length: 24 }).map((_, h) => (
              <span key={h}>{h % 3 === 0 ? `${h}h` : ""}</span>
            ))}
          </div>

          {/* Days */}
          {DAYS.map((dayName, dayIdx) => (
            <div
              key={dayIdx}
              className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 items-center"
            >
              <span className="text-[10px] font-mono text-[#64748b]">
                {dayName}
              </span>
              {Array.from({ length: 24 }).map((_, hour) => {
                const cell = data.find(
                  (d) => d.day === dayIdx && d.hour === hour
                ) || { day: dayIdx, hour, count: 0 };

                return (
                  <div
                    key={hour}
                    className={`h-5 rounded-sm transition-all cursor-pointer ${getCellColor(
                      cell.count
                    )} hover:ring-2 hover:ring-white`}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 text-[10px] text-[#64748b] font-mono pt-1">
        <span>Less active</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#121824]" />
          <div className="w-3 h-3 rounded-sm bg-[#6366f1]/25" />
          <div className="w-3 h-3 rounded-sm bg-[#6366f1]/50" />
          <div className="w-3 h-3 rounded-sm bg-[#6366f1]/75" />
          <div className="w-3 h-3 rounded-sm bg-[#6366f1]" />
        </div>
        <span>Peak activity</span>
      </div>
    </div>
  );
}
