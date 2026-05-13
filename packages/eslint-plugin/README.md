# @marcuscastelo/eslint-plugin

Custom ESLint rules for Solid platform code.

## Rules

- `platform/no-iife-in-jsx`: flags IIFEs inside JSX expressions.
- `platform/no-jsx-short-circuit`: flags JSX-producing short-circuit expressions.
- `platform/no-jsx-ternary`: flags JSX-producing ternary branches.

## Usage

```js
import platform from "@marcuscastelo/eslint-plugin";

export default [
  {
    plugins: { platform },
    rules: {
      "platform/no-iife-in-jsx": "error",
      "platform/no-jsx-short-circuit": "error",
      "platform/no-jsx-ternary": "error",
    },
  },
];
```

## Development

- Rules live in `src/rules`.
- JSX helpers live in `src/utils/jsx.js`.
- Tests live in `tests`.
- Run `pnpm --filter @marcuscastelo/eslint-plugin test` after rule changes.
