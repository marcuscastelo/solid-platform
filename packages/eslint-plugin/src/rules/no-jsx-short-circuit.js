import { containsExplicitJsx } from "../utils/jsx.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow short-circuit JSX rendering with cond && <JSX />.",
      recommended: false,
    },
    schema: [],
    messages: {
      avoidJsxShortCircuit:
        "Do not use cond && <JSX /> for conditional rendering. Use <Show when={cond}>...</Show> instead.",
    },
  },
  create(context) {
    return {
      JSXExpressionContainer(node) {
        const { expression } = node;

        if (!expression || expression.type !== "LogicalExpression") {
          return;
        }

        if (expression.operator !== "&&") {
          return;
        }

        if (!containsExplicitJsx(expression.right)) {
          return;
        }

        context.report({
          node: expression,
          messageId: "avoidJsxShortCircuit",
        });
      },
    };
  },
};
