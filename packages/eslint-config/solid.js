import platformPlugin from "@marcuscastelo/eslint-plugin";
import solid from "eslint-plugin-solid/configs/typescript";
import * as tsParser from "@typescript-eslint/parser";

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

	// JSX rules (genéricas)
	{
		files: ["**/*.tsx"],
		rules: {
			"platform/no-jsx-short-circuit": "error",
			"platform/no-jsx-ternary": "error",
			"platform/no-iife-in-jsx": "warn",
		},
	},

	// Navegação imperativa proibida (genérico)
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

	// ViewModel = shape only
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
