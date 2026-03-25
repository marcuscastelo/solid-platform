import noIifeInJsx from "./rules/no-iife-in-jsx.js";
import noJsxShortCircuit from "./rules/no-jsx-short-circuit.js";
import noJsxTernary from "./rules/no-jsx-ternary.js";

export const rules = {
  "no-iife-in-jsx": noIifeInJsx,
  "no-jsx-short-circuit": noJsxShortCircuit,
  "no-jsx-ternary": noJsxTernary,
};

export const eslintPlugin = {
  meta: {
    name: "@marcuscastelo/eslint-plugin",
  },
  rules,
};

export const containerTrackerEslintPlugin = eslintPlugin;

export default eslintPlugin;
