import base from "./base.js";
import boundariesModules from "../internal/boundaries/modules.js";
import uiFunctionSize from "../internal/ui/function-size.js";
import uiComponentComplexity from "../internal/ui/component-complexity.js";
import uiPageComplexity from "../internal/ui/page-complexity.js";
import uiJsxRuntime from "../internal/ui/jsx-runtime.js";
import uiJsxRules from "../internal/ui/jsx-rules.js";
import navigationSafety from "../internal/navigation/safety.js";
import vmShape from "../internal/vm/shape.js";

export default [
  ...base,
  boundariesModules,
  ...uiJsxRuntime,
  uiFunctionSize,
  uiComponentComplexity,
  uiPageComplexity,
  navigationSafety,
  vmShape,
  uiJsxRules,
];
