import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        brand: "var(--color-brand)",
        signal: "var(--color-signal)",
        surface: "var(--color-surface)",
      },
      borderRadius: {
        panel: "var(--radius-panel)",
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
      },
      transitionDuration: {
        fast: "var(--motion-fast)",
        base: "var(--motion-base)",
        slow: "var(--motion-slow)",
      },
    },
  },
  plugins: [],
};

export default config;
