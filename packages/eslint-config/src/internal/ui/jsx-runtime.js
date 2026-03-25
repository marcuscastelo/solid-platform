import platformPlugin from "@marcuscastelo/eslint-plugin";
import solid from "eslint-plugin-solid/configs/typescript";
import * as tsParser from "@typescript-eslint/parser";

export default [
  {
    plugins: {
      platform: platformPlugin,
    },
  },

  {
    files: ["**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
    rules: {
      ...(solid.rules ?? {}),
      "solid/components-return-once": "error",
    },
  },
];
