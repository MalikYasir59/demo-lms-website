"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Check } from "lucide-react";

const emptySubscribe = () => () => {};

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-muted border border-border" />
        ))}
      </div>
    );
  }

  const options = [
    {
      id: "light",
      label: "Light Mode",
      desc: "Clean, bright workspace aesthetic",
      icon: Sun,
      iconColor: "text-warning",
    },
    {
      id: "dark",
      label: "Dark Mode",
      desc: "Deep, comfortable low-strain palette",
      icon: Moon,
      iconColor: "text-primary",
    },
    {
      id: "system",
      label: "System Sync",
      desc: "Matches your operating system preference",
      icon: Laptop,
      iconColor: "text-success",
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
                ? "bg-primary/10 border-primary ring-1 ring-primary"
                : "bg-muted border-border hover:border-muted-foreground/30"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border border-border ${
                  isSelected ? "bg-primary/20 text-primary" : "bg-card text-muted-foreground"
                } ${opt.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            <div>
              <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                {opt.label}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
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
