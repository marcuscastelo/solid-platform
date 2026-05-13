# AGENTS.md

## Scope

`packages/eslint-config`.

## Package

- Public package: `@marcuscastelo/eslint-config`.
- ESM flat config package.
- Public presets: `base`, `node`, `solid`.

## Rules

- Keep public exports aligned with `package.json`.
- Put reusable config fragments in `src/internal` or `src/shared`.
- Keep presets in `src/presets`.
- Run `pnpm --filter @marcuscastelo/eslint-config test` after rule/config behavior changes.
- Do not run `pnpm version:packages` or create changesets unless explicitly requested.
