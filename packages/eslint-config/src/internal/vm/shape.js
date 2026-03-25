import { createRestrictedSyntaxFragment } from "../../shared/utils.js";

export default createRestrictedSyntaxFragment(["**/*.vm.ts"], [
  {
    selector: "ExportNamedDeclaration > FunctionDeclaration",
    message:
      "*.vm.ts files must export shape/type/constants only, not behavioral functions.",
  },
  {
    selector:
      "ExportNamedDeclaration VariableDeclaration > VariableDeclarator[init.type='ArrowFunctionExpression']",
    message: "*.vm.ts files must not export behavioral arrow functions.",
  },
  {
    selector:
      "ExportNamedDeclaration VariableDeclaration > VariableDeclarator[init.type='FunctionExpression']",
    message: "*.vm.ts files must not export behavioral function expressions.",
  },
]);
