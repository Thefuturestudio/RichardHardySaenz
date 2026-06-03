import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "var(--font-intra)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        display: ["var(--font-viva-display)", "var(--font-intra)", "sans-serif"],
      },
      colors: {
        viva: {
          bg: "rgb(var(--viva-bg) / <alpha-value>)",
          surface: "rgb(var(--viva-surface) / <alpha-value>)",
          card: "rgb(var(--viva-card) / <alpha-value>)",
          elevated: "rgb(var(--viva-elevated) / <alpha-value>)",
          ink: "rgb(var(--viva-ink) / <alpha-value>)",
          muted: "rgb(var(--viva-muted) / <alpha-value>)",
          subtle: "rgb(var(--viva-subtle) / <alpha-value>)",
          line: "rgb(var(--viva-line) / <alpha-value>)",
          primary: "rgb(var(--viva-primary) / <alpha-value>)",
          purple: "rgb(var(--viva-primary) / <alpha-value>)",
          blue: "rgb(var(--viva-blue) / <alpha-value>)",
          teal: "rgb(var(--viva-teal) / <alpha-value>)",
          pink: "rgb(var(--viva-pink) / <alpha-value>)",
          success: "rgb(var(--viva-success) / <alpha-value>)",
          warning: "rgb(var(--viva-warning) / <alpha-value>)",
          error: "rgb(var(--viva-error) / <alpha-value>)",
          green: "rgb(var(--viva-primary) / <alpha-value>)",
          mint: "rgb(var(--viva-primary-soft) / <alpha-value>)",
          gold: "rgb(var(--viva-warning) / <alpha-value>)",
        },
      },
      backgroundImage: {
        "viva-gradient":
          "linear-gradient(135deg, rgb(var(--viva-teal)) 0%, rgb(var(--viva-blue)) 38%, rgb(var(--viva-primary)) 68%, rgb(var(--viva-pink)) 100%)",
        "viva-gradient-soft":
          "linear-gradient(135deg, rgb(var(--viva-teal) / 0.16), rgb(var(--viva-primary) / 0.14), rgb(var(--viva-pink) / 0.12))",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        glow: "var(--shadow-glow)",
        glass: "var(--shadow-glass)",
      },
    },
  },
  plugins: [forms],
};

export default config;
