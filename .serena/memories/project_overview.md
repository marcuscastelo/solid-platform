# Project overview
- Repo: `solid-platform`, private pnpm workspace.
- Workspace packages: `packages/*`, `sandbox-app`.
- Packages: `@marcuscastelo/eslint-config`, `@marcuscastelo/eslint-plugin`, `@marcuscastelo/tsconfig`, `@marcuscastelo/vitest-config`, `@marcuscastelo/ci-presets`.
- Additional ignored working dir: `from-container-tracker/`.
- Package manager: `pnpm@10.20.0`.
- Release tooling: Changesets. Do not run `pnpm version:packages` unless explicitly requested.