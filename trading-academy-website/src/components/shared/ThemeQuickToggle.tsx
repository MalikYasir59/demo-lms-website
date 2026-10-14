"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeQuickToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`w-8 h-8 rounded-xl bg-[#121824] ${className}`} />;
  }

  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`p-2 rounded-xl bg-[#121824] hover:bg-[#1e293b] border border-[#1e293b] text-[#94a3b8] hover:text-white transition-all cursor-pointer ${className}`}
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      aria-label="Toggle visual theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-400 hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}

export default ThemeQuickToggle;
