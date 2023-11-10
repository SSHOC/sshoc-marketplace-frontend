import { createPreset } from "@acdh-oeaw/tailwindcss-preset";
import type { Config } from "tailwindcss";
import reactAriaComponentsPlugin from "tailwindcss-react-aria-components";

const designTokensPreset = createPreset();

const config = {
	content: [
		"./app/**/*.@(css|ts|tsx)",
		"./components/**/*.@(css|ts|tsx)",
		"./content/**/*.@(md|mdoc|mdx)",
	],
	plugins: [reactAriaComponentsPlugin],
	presets: [designTokensPreset],
} satisfies Config;

export default config;
