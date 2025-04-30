import baseConfig from "@acdh-oeaw/eslint-config";
import reactConfig from "@acdh-oeaw/eslint-config-react";
// @ts-expect-error Missing type declaration.
import nextPlugin from "@next/eslint-plugin-next";
import gitignore from "eslint-config-flat-gitignore";
import { config } from "typescript-eslint";

export default config(
	gitignore({ strict: false }),
	{ ignores: ["content/**", "public/**"] },
	baseConfig,
	reactConfig,
	nextPlugin.flatConfig.coreWebVitals,
	{
		files: ["**/*.cjs", "**/*.js"],
		rules: {
			"no-undef": "off",
		},
	},
	{
		rules: {
			"prefer-template": "off",
			"@typescript-eslint/consistent-type-definitions": "off",
			"@typescript-eslint/dot-notation": "off",
			"@typescript-eslint/no-confusing-void-expression": "off",
			"@typescript-eslint/no-deprecated": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-floating-promises": "off",
			"@typescript-eslint/no-invalid-void-type": "off",
			"@typescript-eslint/no-namespace": "off",
			"@typescript-eslint/no-unnecessary-boolean-literal-compare": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/non-nullable-type-assertion-style": "off",
			"@typescript-eslint/prefer-nullish-coalescing": "off",
			"@typescript-eslint/prefer-optional-chain": "off",
			"@typescript-eslint/require-await": "off",
			"@typescript-eslint/restrict-template-expressions": "off",
			"@typescript-eslint/switch-exhaustiveness-check": "off",
			"@typescript-eslint/unbound-method": "off",
			"import-x/no-duplicates": "off",
			"react/jsx-boolean-value": "off",
		},
	},
);
