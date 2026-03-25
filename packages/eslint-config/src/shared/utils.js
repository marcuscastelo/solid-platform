export function createRestrictedSyntaxFragment(files, selectors) {
  return {
    files,
    rules: {
      "no-restricted-syntax": ["error", ...selectors],
    },
  };
}
