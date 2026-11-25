import { defineConfig } from "oxlint";

export default defineConfig({
	plugins: ["typescript", "react", "react-perf", "jsx-a11y", "nextjs", "import", "unicorn", "oxc"],
	env: { browser: true, node: true },
	ignorePatterns: ["content/**", "public/**"],
	options: { typeAware: true, typeCheck: true },
	rules: {
		// Keep explicit list semantics when CSS removes list markers (Safari/VoiceOver).
		"jsx-a11y/no-redundant-roles": ["warn", { ul: ["list"], ol: ["list"] }],
		"no-restricted-properties": [
			"error",
			{
				object: "process",
				property: "env",
				message: "Please use `@/config/env.config` instead.",
			},
		],
		"typescript/no-explicit-any": "off",
		"typescript/no-floating-promises": "off",
		"typescript/no-unsafe-argument": "off",
		"typescript/no-unsafe-assignment": "off",
		"typescript/no-unsafe-call": "off",
		"typescript/no-unsafe-member-access": "off",
		"typescript/no-unsafe-return": "off",
	},
	overrides: [{ files: ["config/env.config.ts"], rules: { "no-restricted-properties": "off" } }],
});
