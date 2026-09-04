import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#092B1C",
          900: "#061d13",
          800: "#092B1C",
          700: "#0d3a26",
        },
        peach: {
          DEFAULT: "#FBBEA6",
          deep: "#F9A97B",
        },
        brick: "#9A3110",
        brown: "#5A3830",
        teal: "#478486",
        sage: "#A7D8B7",
        paper: "#F4EFE8",
        sand: "#E8DED2",
        ink: "#0c0c0a",
        gold: "#C4A574",
        silver: "#B7B3A9",
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
