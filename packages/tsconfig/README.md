# @marcuscastelo/tsconfig

Shared TypeScript config presets.

## Exports

- `@marcuscastelo/tsconfig/base`: strict base config.
- `@marcuscastelo/tsconfig/node`: Node config.
- `@marcuscastelo/tsconfig/solid`: Solid JSX config.

## Usage

```json
{
  "extends": "@marcuscastelo/tsconfig/solid"
}
```

## Development

- Presets live in `src/presets`.
- Keep exported preset paths aligned with `package.json`.
- Run relevant TypeScript checks in consumers after changing compiler options.
