import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
	oxc: { jsx: { runtime: "automatic" } },
	test: {
		environment: "jsdom",
		include: ["tests/**/*.test.{ts,tsx}"],
		setupFiles: ["./tests/setup.ts"],
		env: {
			NEXT_PUBLIC_APP_BASE_URL: "http://localhost:3000",
			NEXT_PUBLIC_API_BASE_URL: "http://localhost:8080",
			REVALIDATION_TOKEN: "form-tests-only",
		},
	},
});
