"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Check } from "lucide-react";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-[#121824] border border-[#1e293b]" />
        ))}
      </div>
    );
  }

  const options = [
    {
      id: "light",
      label: "Light Mode",
      desc: "Clean institutional daylight aesthetic",
      icon: Sun,
      iconColor: "text-amber-500",
    },
    {
      id: "dark",
      label: "Dark Mode",
      desc: "Obsidian low-strain terminal palette",
      icon: Moon,
      iconColor: "text-indigo-400",
    },
    {
      id: "system",
      label: "System Sync",
      desc: "Matches your operating system preference",
      icon: Laptop,
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = theme === opt.id;

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
              isSelected
                ? "bg-[#6366f1]/10 border-[#6366f1] ring-1 ring-[#6366f1]"
                : "bg-[#121824] border-[#1e293b] hover:border-[#334155]"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border border-[#1e293b] ${
                  isSelected ? "bg-[#6366f1]/20 text-[#6366f1]" : "bg-[#0b0f17] text-[#94a3b8]"
                } ${opt.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-[#6366f1] text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            <div>
              <div className="text-xs font-bold text-white group-hover:text-[#6366f1] transition-colors">
                {opt.label}
              </div>
              <div className="text-[11px] text-[#64748b] mt-0.5 leading-snug">
                {opt.desc}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ThemeSelector;
