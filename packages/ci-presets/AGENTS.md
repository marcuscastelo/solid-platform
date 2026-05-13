# AGENTS.md

## Scope

`packages/ci-presets`.

## Package

- Private package: `@marcuscastelo/ci-presets`.
- Entry: `src/index.js`.
- Current API: empty ESM export.

## Rules

- Keep package private.
- Do not add package versions or changesets unless explicitly requested.
- Keep CI preset exports centralized in `src/index.js`.
- For docs-only changes, tests may be skipped with note.
