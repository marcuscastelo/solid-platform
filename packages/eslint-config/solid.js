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

	// JSX rules (genéricas)
	// TODO: aplicar quando tiver os rules movidos
	// {
	// 	files: ["**/*.tsx"],
	// 	rules: {
	// 		"platform/no-jsx-short-circuit": "error",
	// 		"platform/no-jsx-ternary": "error",
	// 		"platform/no-iife-in-jsx": "warn",
	// 	},
	// },

	{
		files: ["**/*.{ts,tsx}"],
		rules: {
			"no-restricted-syntax": [
				"error",
				{
					selector:
						"AssignmentExpression[left.type='MemberExpression'][left.object.name='location'][left.property.name='href']",
					message: "Use router helpers instead of location.href",
				},
				{
					selector:
						"MemberExpression[object.name='window'][property.name='location']",
					message: "Use router helpers instead of window.location",
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
					message: "*.vm.ts must not export functions",
				},
			],
		},
	},
];