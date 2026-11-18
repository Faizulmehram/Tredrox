import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      ".claude/**",
      ".agent/**",
      ".agents/**",
      ".cursor/**",
      ".gemini/**",
      ".codex/**",
      ".impeccable/**",
    ],
  },
];

export default config;
