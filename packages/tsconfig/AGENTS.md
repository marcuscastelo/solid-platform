# AGENTS.md

## Scope

`packages/tsconfig`.

## Package

- Public package: `@marcuscastelo/tsconfig`.
- JSON presets only.
- Public presets: `base`, `node`, `solid`.

## Rules

- Keep presets in `src/presets`.
- Keep `package.json` exports aligned with preset files.
- Prefer strict compiler options.
- Validate changed presets in a consumer package when possible.
- Do not run `pnpm version:packages` or create changesets unless explicitly requested.
