import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      // Hydration, URL-sync and portal-mount effects intentionally mirror
      // external browser state into React; these are not derived-state loops.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "private/**",
    "public/**",
    "next-env.d.ts",
  ]),
]);
