import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand — deep forest green dominates (~80%)
        forest: {
          DEFAULT: "#092B1C",
          900: "#061d13",
          800: "#092B1C",
          700: "#0d3a26",
          600: "#13503480",
        },
        // Warm peach accent (~20%)
        peach: {
          DEFAULT: "#FBBEA6",
          deep: "#F9A97B",
        },
        // Darkened terracotta: clears WCAG AA (4.5:1) for small text on both
        // paper (~6.5:1) and the peach surface (~4.6:1). Was #C15C3B (failed AA).
        brick: "#9A3110",
        brown: "#5A3830",
        teal: "#478486",
        sage: "#A7D8B7",
        // Neutral warm paper
        paper: "#F4EFE8",
        ink: "#0c0c0a",
      },
      fontFamily: {
        sans: ["var(--font-peyda)", "system-ui", "sans-serif"],
        display: ["var(--font-peyda)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        container: "1600px",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-quint": "cubic-bezier(0.83, 0, 0.17, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
