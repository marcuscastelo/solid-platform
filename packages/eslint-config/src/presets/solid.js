import platformPlugin from "@marcuscastelo/eslint-plugin";
import solid from "eslint-plugin-solid/configs/typescript";
import * as tsParser from "@typescript-eslint/parser";

const platformUiFiles = [
  "src/modules/*/ui/**/*.{ts,tsx}",
  "src/modules/*/features/*/ui/**/*.{ts,tsx}",
  "src/capabilities/*/ui/**/*.{ts,tsx}",
  "src/shared/ui/**/*.{ts,tsx}",
];

const platformUiComponentFiles = [
  "src/modules/*/ui/components/**/*.{ts,tsx}",
  "src/modules/*/features/*/ui/components/**/*.{ts,tsx}",
  "src/capabilities/*/ui/components/**/*.{ts,tsx}",
  "src/shared/ui/**/*.{ts,tsx}",
];

const platformUiPageFiles = [
  "src/modules/*/ui/screens/**/*.{ts,tsx}",
  "src/modules/*/ui/routes/**/*.{ts,tsx}",
  "src/modules/*/ui/pages/**/*.{ts,tsx}",
  "src/modules/*/ui/*View.tsx",
  "src/modules/*/ui/*Dialog.tsx",
  "src/modules/*/ui/**/index.tsx",

  "src/modules/*/features/*/ui/screens/**/*.{ts,tsx}",
  "src/modules/*/features/*/ui/routes/**/*.{ts,tsx}",
  "src/modules/*/features/*/ui/pages/**/*.{ts,tsx}",
  "src/modules/*/features/*/ui/*View.tsx",
  "src/modules/*/features/*/ui/*Dialog.tsx",
  "src/modules/*/features/*/ui/**/index.tsx",

  "src/capabilities/*/ui/screens/**/*.{ts,tsx}",
  "src/capabilities/*/ui/routes/**/*.{ts,tsx}",
  "src/capabilities/*/ui/pages/**/*.{ts,tsx}",
  "src/capabilities/*/ui/*View.tsx",
  "src/capabilities/*/ui/*Dialog.tsx",
  "src/capabilities/*/ui/**/index.tsx",
];

export default [
  {
    plugins: {
      platform: platformPlugin,
    },
  },

  {
    files: ["**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
    rules: {
      ...(solid.rules ?? {}),
      "solid/components-return-once": "error",
    },
  },

  {
    files: ["src/modules/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["~/capabilities/**"],
              message: "Modules must not depend on capabilities.",
            },
          ],
        },
      ],
    },
  },

  {
    files: platformUiFiles,
    rules: {
      "max-lines-per-function": ["error", 220],
    },
  },

  {
    files: platformUiComponentFiles,
    rules: {
      complexity: ["error", 15],
      "max-depth": ["error", 4],
      "max-nested-callbacks": ["error", 3],
    },
  },

  {
    files: platformUiPageFiles,
    rules: {
      complexity: ["error", 20],
      "max-depth": ["error", 5],
      "max-nested-callbacks": ["error", 4],
    },
  },

  // JSX rules (generic)
  // TODO: enable when moved to shared plugin
  // {
  //   files: ["**/*.tsx"],
  //   rules: {
  //     "platform/no-jsx-short-circuit": "error",
  //     "platform/no-jsx-ternary": "error",
  //     "platform/no-iife-in-jsx": "warn",
  //   },
  // },

  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "AssignmentExpression[left.type='MemberExpression'][left.object.name='location'][left.property.name='href']",
          message:
            "Use router navigation helpers for internal routes. location.href assignment is forbidden.",
        },
        {
          selector:
            "MemberExpression[object.name='window'][property.name='location']",
          message:
            "window.location usage is forbidden in app code. Use router navigation and helper utilities.",
        },
        {
          selector:
            "MemberExpression[object.name='document'][property.name='location']",
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
      ],
    },
  },

  {
    files: ["**/*.vm.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportNamedDeclaration > FunctionDeclaration",
          message:
            "*.vm.ts files must export shape/type/constants only, not behavioral functions.",
        },
        {
          selector:
            "ExportNamedDeclaration VariableDeclaration > VariableDeclarator[init.type='ArrowFunctionExpression']",
          message:
            "*.vm.ts files must not export behavioral arrow functions.",
        },
        {
          selector:
            "ExportNamedDeclaration VariableDeclaration > VariableDeclarator[init.type='FunctionExpression']",
          message:
            "*.vm.ts files must not export behavioral function expressions.",
        },
      ],
    },
  },
];