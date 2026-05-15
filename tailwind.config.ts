import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#030505",
        fog: "#d8e3dc",
        mint: "#b9d6c8",
        graphite: "#111414",
        panel: "#0c0f0f"
      },
      boxShadow: {
        glow: "0 0 80px rgba(190, 220, 206, 0.22)",
        soft: "0 24px 80px rgba(0, 0, 0, 0.35)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"]
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        fadeUp: "fadeUp .7s ease-out both"
      }
    }
  },
  plugins: [forms]
};

export default config;
