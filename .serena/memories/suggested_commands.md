# Suggested commands
- `pnpm test`: run workspace tests where present.
- `pnpm check:pack`: pack workspace packages into `.tmp-packs`.
- `pnpm release`: pack, publish packages, tag published packages.
- `pnpm changeset:auto`: generate changesets with script.
- `pnpm changeset:auto:yes`: generate automated changesets with default message.
- Avoid `pnpm version:packages` unless package version bumps are intended.
- Git: use `git status --short --branch`, `git add`, `git commit`, `git push origin main`.