import type { Route } from "@playwright/test";

export function fulfillLocalJson(route: Route, body: unknown) {
	return route.fulfill({
		status: 200,
		contentType: "application/json",
		body: JSON.stringify(body),
		headers: {
			"access-control-allow-origin": "http://127.0.0.1:3117",
			"access-control-allow-credentials": "true",
		},
	});
}
