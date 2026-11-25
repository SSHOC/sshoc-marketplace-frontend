import { defineConfig } from "oxfmt";

export default defineConfig({
	useTabs: true,
	printWidth: 100,
	sortImports: {
		internalPattern: ["@/"],
		groups: [
			["side_effect"],
			["side_effect_style"],
			["style"],
			["builtin"],
			["external"],
			["internal"],
			["unknown"],
		],
	},
	sortTailwindcss: {
		functions: ["cn", "styles"],
		stylesheet: "./styles/index.css",
	},
	ignorePatterns: ["pnpm-lock.yaml", "pnpm-workspace.yaml", "**/*.mdx", "content/", "public/"],
});
