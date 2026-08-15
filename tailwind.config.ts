import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#05070c",
          panel: "#0b1220",
          panel2: "#0e1626",
          line: "rgba(148, 163, 184, 0.14)"
        },
        accent: {
          blue: "#3b82f6",
          "blue-soft": "#60a5fa",
          purple: "#8b5cf6",
          "purple-soft": "#a78bfa"
        },
        status: {
          healthy: "#34d399",
          review: "#fbbf24",
          blocked: "#f87171",
          idle: "#94a3b8"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        panel: "0 20px 60px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
