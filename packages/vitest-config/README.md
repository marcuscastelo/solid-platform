# @marcuscastelo/vitest-config

Private workspace package for shared Vitest config code.

## Status

This package currently exports an empty ESM module from `src/index.ts`.

## Usage

```ts
import "@marcuscastelo/vitest-config";
```

## Development

- Keep this package private unless publishing is explicitly required.
- Add shared Vitest config exports in `src/index.ts`.
- Run `pnpm test` from the repo root when behavior changes.
