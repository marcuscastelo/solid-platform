# AGENTS.md

## Scope

Repo root.

## Communication

- Speak like caveman.
- Remove filler.
- Keep technical terms, code blocks, and error messages exact.
- Final output: location, problem, fix.

## Repo

- pnpm workspace using `pnpm@10.20.0`.
- Workspaces: `packages/*`, `sandbox-app`.
- Published packages live under `packages/*`.
- Generated paths: `node_modules/`, `.tmp-packs/`.

## Commands

- Use `pnpm test` for relevant code changes.
- Use `pnpm check:pack` before package publishing changes.
- Do not run `pnpm version:packages` or `changeset version` unless explicitly requested.
- Do not create changesets for docs-only changes unless explicitly requested.

## Git

- Check `git status --short --branch` before commit.
- Commit only intended files.
- Keep unrelated local and untracked files out of commits.
