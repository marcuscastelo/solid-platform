# Style and conventions
- TypeScript/JavaScript monorepo using ESM in several packages (`type: module`).
- Keep package changes scoped; do not generate package versions unless requested.
- Use pnpm workspace patterns and package-local tests.
- Ignore generated directories such as `.tmp-packs/`, `node_modules/`, and ignored `from-container-tracker/`.