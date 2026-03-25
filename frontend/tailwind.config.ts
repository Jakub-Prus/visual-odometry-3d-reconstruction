import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#090b10",
        panel: "#121722",
        muted: "#8b9bb7",
        border: "#253147",
        accent: "#64d3ff",
        success: "#6de5a1",
        warning: "#ffb561",
        danger: "#ff7d7d"
      },
      fontFamily: {
        sans: ["'IBM Plex Sans'", "Segoe UI", "sans-serif"],
        mono: ["'IBM Plex Mono'", "Consolas", "monospace"]
      },
      boxShadow: {
        panel: "0 18px 48px rgba(0, 0, 0, 0.28)"
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at top, rgba(100, 211, 255, 0.16), transparent 35%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
      },
      backgroundSize: {
        "grid-glow": "auto, 28px 28px, 28px 28px"
      }
    }
  },
  plugins: []
};

export default config;
