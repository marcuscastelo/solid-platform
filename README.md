# solid-platform

Shared platform tooling for pnpm workspace projects.

## Workspace

- `packages/eslint-config`: shared ESLint config.
- `packages/eslint-plugin`: custom ESLint rules.
- `packages/tsconfig`: shared TypeScript config.
- `packages/vitest-config`: shared Vitest config.
- `packages/ci-presets`: CI presets.
- `sandbox-app`: local sandbox app for integration checks.

## Commands

- `pnpm test`: run workspace tests where present.
- `pnpm check:pack`: pack workspace packages into `.tmp-packs`.
- `pnpm changeset:auto`: generate package changesets with the repo script.
- `pnpm release`: pack, publish packages, then tag published packages.

## Release

Package versioning is managed through Changesets. Do not run `pnpm version:packages` unless preparing a package version update.
