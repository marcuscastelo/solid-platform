# AGENTS.md

## Scope

`packages/eslint-plugin`.

## Package

- Public package: `@marcuscastelo/eslint-plugin`.
- ESM ESLint plugin.
- Rules: `no-iife-in-jsx`, `no-jsx-short-circuit`, `no-jsx-ternary`.

## Rules

- Add rule implementations in `src/rules`.
- Reuse JSX helpers from `src/utils/jsx.js`.
- Update `src/index.js` exports for new rules.
- Add or update `tests/*.test.mjs` for rule behavior.
- Run `pnpm --filter @marcuscastelo/eslint-plugin test` after rule changes.
- Do not run `pnpm version:packages` or create changesets unless explicitly requested.
