import { uiComponentFiles } from "../../shared/globs.js";

export default {
  files: uiComponentFiles,
  rules: {
    complexity: ["error", 15],
    "max-depth": ["error", 4],
    "max-nested-callbacks": ["error", 3],
  },
};
