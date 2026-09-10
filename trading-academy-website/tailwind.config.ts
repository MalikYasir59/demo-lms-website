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
        brand: {
          emerald: "#10b981",
          "emerald-hover": "#059669",
          "emerald-dark": "#00422b",
          "emerald-soft": "#ecfdf5",
          navy: "#070b14",
          "navy-light": "#0b1220",
          "navy-surface": "#11192a",
          "navy-card": "#0c1220",
          slate: "#334155",
          "slate-muted": "#64748b",
          "slate-border": "#e2e8f0",
          royal: "#1e40af",
          "royal-accent": "#3755c3",
          surface: "#faf8ff",
          mist: "#f8fafc",
        },
        primary: {
          DEFAULT: "#10b981",
          hover: "#059669",
          dark: "#00422b",
          light: "#9df4c8",
        },
        secondary: {
          DEFAULT: "#3755c3",
          hover: "#2943a3",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "terminal-grid":
          "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-32": "32px 32px",
      },
    },
  },
  plugins: [],
};

export default config;

