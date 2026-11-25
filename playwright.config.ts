import { defineConfig } from "@playwright/test";

// This suite writes disposable records: keep both the frontend and API on loopback.
export default defineConfig({
	testDir: "./tests/e2e",
	workers: 1,
	timeout: 90_000,
	use: { baseURL: "http://127.0.0.1:3117", browserName: "chromium", trace: "retain-on-failure" },
	webServer: {
		command: "pnpm dev --hostname 127.0.0.1 --port 3117",
		url: "http://127.0.0.1:3117/auth/sign-in",
		reuseExistingServer: false,
		timeout: 120_000,
		env: {
			NEXT_PUBLIC_APP_BASE_URL: "http://127.0.0.1:3117",
			NEXT_PUBLIC_API_BASE_URL: "http://localhost:8080",
		},
	},
});
