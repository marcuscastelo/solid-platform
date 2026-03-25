import { createRestrictedSyntaxFragment } from "../../shared/utils.js";

export default createRestrictedSyntaxFragment(["**/*.{ts,tsx}"], [
  {
    selector:
      "AssignmentExpression[left.type='MemberExpression'][left.object.name='location'][left.property.name='href']",
    message:
      "Use router navigation helpers for internal routes. location.href assignment is forbidden.",
  },
  {
    selector: "MemberExpression[object.name='window'][property.name='location']",
    message:
      "window.location usage is forbidden in app code. Use router navigation and helper utilities.",
  },
  {
    selector: "MemberExpression[object.name='document'][property.name='location']",
    message:
      "document.location usage is forbidden in app code. Use router navigation and helper utilities.",
  },
  {
    selector:
      "AssignmentExpression[left.type='MemberExpression'][left.object.type='MemberExpression'][left.object.object.name='window'][left.object.property.name='location'][left.property.name='href']",
    message:
      "Use router navigation helpers for internal routes. window.location.href assignment is forbidden.",
  },
  {
    selector:
      "CallExpression[callee.type='MemberExpression'][callee.object.name='location'][callee.property.name=/^(assign|replace|reload)$/]",
    message:
      "Use router navigation + targeted refetch/reconcile. location.assign/replace/reload are forbidden.",
  },
  {
    selector:
      "CallExpression[callee.type='MemberExpression'][callee.object.type='MemberExpression'][callee.object.object.name='window'][callee.object.property.name='location'][callee.property.name=/^(assign|replace|reload)$/]",
    message:
      "Use router navigation + targeted refetch/reconcile. window.location.assign/replace/reload are forbidden.",
  },
  {
    selector:
      "CallExpression[callee.type='MemberExpression'][callee.object.name='window'][callee.property.name='navigate']",
    message: "Use router navigation helpers. window.navigate is forbidden.",
  },
  {
    selector:
      "CallExpression[callee.type='MemberExpression'][callee.object.name='history'][callee.property.name='pushState']",
    message:
      "Manual history.pushState is forbidden in app code. Use router navigation helpers.",
  },
  {
    selector:
      "CallExpression[callee.type='MemberExpression'][callee.object.type='MemberExpression'][callee.object.object.name='window'][callee.object.property.name='history'][callee.property.name='pushState']",
    message:
      "Manual window.history.pushState is forbidden in app code. Use router navigation helpers.",
  },
]);
