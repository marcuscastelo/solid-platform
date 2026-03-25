const jsxWrapperTypes = new Set([
  "ParenthesizedExpression",
  "TSNonNullExpression",
  "TSAsExpression",
  "TSTypeAssertion",
  "TSSatisfiesExpression",
]);

export function unwrapExpressionWrappers(node) {
  let currentNode = node;

  while (currentNode && jsxWrapperTypes.has(currentNode.type)) {
    if (currentNode.type === "ParenthesizedExpression") {
      currentNode = currentNode.expression;
      continue;
    }

    if (currentNode.type === "TSNonNullExpression") {
      currentNode = currentNode.expression;
      continue;
    }

    if (currentNode.type === "TSAsExpression") {
      currentNode = currentNode.expression;
      continue;
    }

    if (currentNode.type === "TSTypeAssertion") {
      currentNode = currentNode.expression;
      continue;
    }

    if (currentNode.type === "TSSatisfiesExpression") {
      currentNode = currentNode.expression;
    }
  }

  return currentNode;
}

export function containsExplicitJsx(node) {
  const unwrappedNode = unwrapExpressionWrappers(node);

  if (!unwrappedNode) {
    return false;
  }

  if (unwrappedNode.type === "JSXElement" || unwrappedNode.type === "JSXFragment") {
    return true;
  }

  if (unwrappedNode.type === "ConditionalExpression") {
    return (
      containsExplicitJsx(unwrappedNode.consequent) || containsExplicitJsx(unwrappedNode.alternate)
    );
  }

  if (unwrappedNode.type === "LogicalExpression" && unwrappedNode.operator === "&&") {
    return containsExplicitJsx(unwrappedNode.right);
  }

  return false;
}
