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
	{
		files: ['src/modules/**/*.{ts,tsx}'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['~/capabilities/**'],
							message: 'Modules must not depend on capabilities.',
						},
					],
				},
			],
		},
	},

	{
		files: ["**/*.tsx"],
		rules: {
			"max-lines-per-function": ["error", 220],
		},
	},

	{
		files: ["**/*.component.tsx"],
		rules: {
			complexity: ["error", 15],
			"max-depth": ["error", 4],
			"max-nested-callbacks": ["error", 3],
		},
	},

	{
		files: ["**/*.page.tsx"],
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