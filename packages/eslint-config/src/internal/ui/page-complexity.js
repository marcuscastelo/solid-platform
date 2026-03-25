import { uiPageFiles } from "../../shared/globs.js";

export default {
  files: uiPageFiles,
  rules: {
    complexity: ["error", 20],
    "max-depth": ["error", 5],
    "max-nested-callbacks": ["error", 4],
  },
};
