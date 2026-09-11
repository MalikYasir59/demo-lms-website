import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          canvas: "#080b11",
          surface: "#0b0f17",
          "container-low": "#121824",
          container: "#1d2026",
          "container-high": "#182234",
          "container-highest": "#272a31",
        },
        execution: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
          light: "#c0c1ff",
        },
        alpha: {
          DEFAULT: "#10b981",
          hover: "#059669",
          mint: "#4edea3",
        },
        sovereign: {
          DEFAULT: "#f59e0b",
          gold: "#ffb95f",
          dark: "#d97706",
        },
        // Backward-compatibility aliases re-pointed to Obsidian Apex
        brand: {
          emerald: "#10b981",
          "emerald-hover": "#059669",
          "emerald-dark": "#003824",
          "emerald-soft": "rgba(16, 185, 129, 0.10)",
          navy: "#080b11",
          "navy-light": "#0b0f17",
          "navy-surface": "#121824",
          "navy-card": "#121824",
          slate: "#182234",
          "slate-muted": "#64748b",
          "slate-border": "rgba(255, 255, 255, 0.08)",
          royal: "#6366f1",
          "royal-accent": "#4f46e5",
          surface: "#080b11",
          mist: "#0b0f17",
        },
        primary: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
          light: "#c0c1ff",
        },
        secondary: {
          DEFAULT: "#10b981",
          hover: "#059669",
        },
      },
      borderRadius: {
        DEFAULT: "0.25rem", // 4px for buttons, inputs
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem", // 8px for cards, panels
        xl: "0.75rem",
        full: "9999px", // for status pills, category chips
      },
      boxShadow: {
        "execution-glow": "0 0 16px rgba(99, 102, 241, 0.45)",
        "execution-glow-lg": "0 0 24px rgba(99, 102, 241, 0.65)",
        "alpha-glow": "0 0 16px rgba(16, 185, 129, 0.35)",
        "sovereign-glow": "0 0 16px rgba(245, 158, 11, 0.35)",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
