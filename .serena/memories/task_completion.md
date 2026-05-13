# Task completion
- Check `git status --short --branch` before committing.
- Run relevant tests for touched packages; for docs-only changes, tests may be skipped with note.
- Do not run `pnpm version:packages` or other version bump commands unless explicitly requested.
- Commit only intended files and avoid unrelated untracked `.serena/` files.