import { containsExplicitJsx } from "../utils/jsx.js";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow JSX ternary rendering with cond ? <A /> : <B />.",
      recommended: false,
    },
    schema: [],
    messages: {
      avoidJsxTernary:
        "Do not use JSX ternary for conditional rendering. Use <Show when={cond}>...</Show> instead.",
    },
  },
  create(context) {
    return {
      JSXExpressionContainer(node) {
        const { expression } = node;

        if (!expression || expression.type !== "ConditionalExpression") {
          return;
        }

        if (
          !containsExplicitJsx(expression.consequent) &&
          !containsExplicitJsx(expression.alternate)
        ) {
          return;
        }

        context.report({
          node: expression,
          messageId: "avoidJsxTernary",
        });
      },
    };
  },
};
