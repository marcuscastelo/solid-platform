import tsParser from "@typescript-eslint/parser";

export const parserOptions = {
  ecmaVersion: "latest",
  sourceType: "module",
  ecmaFeatures: {
    jsx: true,
  },
};

export function createRuleTesterConfig(plugin, alias = "platform") {
  return {
    languageOptions: {
      parser: tsParser,
      parserOptions,
    },
    plugins: {
      [alias]: plugin,
    },
  };
}
