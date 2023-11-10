import { test as setup } from "@playwright/test";

import { env } from "@/config/env.config";

if (env.NEXT_PUBLIC_MATOMO_BASE_URL && env.NEXT_PUBLIC_MATOMO_BASE_URL) {
	const baseUrl = env.NEXT_PUBLIC_MATOMO_BASE_URL;

	setup.beforeEach("block requests to analytics service", async ({ context }) => {
		await context.route(baseUrl, (route) => {
			return route.fulfill({ status: 204, body: "" });
		});
	});
}
