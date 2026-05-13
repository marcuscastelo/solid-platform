# @marcuscastelo/eslint-config

Shared ESLint flat config presets for platform projects.

## Exports

- `@marcuscastelo/eslint-config`: named exports `base`, `node`, and `solid`.
- `@marcuscastelo/eslint-config/base`: base preset.
- `@marcuscastelo/eslint-config/node`: Node preset.
- `@marcuscastelo/eslint-config/solid`: Solid preset.

## Usage

```js
import { solid } from "@marcuscastelo/eslint-config";

export default [...solid];
```

## Development

- Presets live in `src/presets`.
- Shared fragments live in `src/internal` and `src/shared`.
- Run `pnpm --filter @marcuscastelo/eslint-config test` after behavior changes.
