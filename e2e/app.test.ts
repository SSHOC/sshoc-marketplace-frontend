import { createUrl } from "@acdh-oeaw/lib";
import { expect, test } from "@playwright/test";

import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";

test.describe("app", () => {
	if (env.BOTS !== "enabled") {
		test("serves a robots.txt which disallows search engine bots", async ({ request }) => {
			const response = await request.get("/robots.txt");
			const body = await response.body();

			expect(body.toString()).toEqual(
				["User-Agent: *", "Disallow: /", "", `Host: ${env.NEXT_PUBLIC_APP_BASE_URL}`, ""].join(
					"\n",
				),
			);
		});
	} else {
		test("serves a robots.txt", async ({ request }) => {
			const response = await request.get("/robots.txt");
			const body = await response.body();

			expect(body.toString()).toEqual(
				[
					"User-Agent: *",
					"Allow: /",
					"",
					`Host: ${env.NEXT_PUBLIC_APP_BASE_URL}`,
					`Sitemap: ${String(
						createUrl({ baseUrl: env.NEXT_PUBLIC_APP_BASE_URL, pathname: "sitemap.xml" }),
					)}`,
					"",
				].join("\n"),
			);
		});
	}

	test("serves a sitemap.xml", async ({ request }) => {
		const response = await request.get("/sitemap.xml");
		const body = await response.body();

		expect(body.toString()).toContain(
			[
				'<?xml version="1.0" encoding="UTF-8"?>',
				'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			].join("\n"),
		);

		for (const locale of locales) {
			for (const url of ["/", "/imprint"]) {
				const loc = String(
					createUrl({
						baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
						pathname: ["/", locale, url].join(""),
					}),
				);

				expect(body.toString()).toContain(["<url>", `<loc>${loc}</loc>`, "<lastmod>"].join("\n"));
			}
		}
	});

	test("serves a webmanifest", async ({ request }) => {
		const response = await request.get("/manifest.webmanifest");
		const body = await response.body();

		expect(body.toString()).toEqual(
			'{"name":"Social Sciences & Humanities Open Marketplace","short_name":"SSHOC Marketplace","description":"Discover new resources for your research in Social Sciences and Humanities: tools, services, training materials and datasets, contextualised.","start_url":"/","display":"standalone","background_color":"#fff","theme_color":"#fff","icons":[{"src":"/icon.svg","sizes":"any","type":"image/svg+xml"},{"src":"/icon-maskable.svg","sizes":"any","type":"image/svg+xml","purpose":"maskable"},{"src":"/android-chrome-192x192.png","sizes":"192x192","type":"image/png"},{"src":"/android-chrome-512x512.png","sizes":"512x512","type":"image/png"}]}',
		);
	});

	test("serves a favicon.ico", async ({ request }) => {
		const response = await request.get("/favicon.ico");
		const status = response.status();

		expect(status).toEqual(200);
	});

	test("serves an svg favicon", async ({ request }) => {
		const response = await request.get("/icon.svg");
		const status = response.status();

		expect(status).toEqual(200);
	});

	test("serves an apple favicon", async ({ request }) => {
		const response = await request.get("/apple-icon.png");
		const status = response.status();

		expect(status).toEqual(200);
	});

	test.describe("sets color mode according to system preference", () => {
		test.use({ colorScheme: "no-preference" });

		test("with no preference", async ({ page }) => {
			await page.goto("/en");
			await expect(page.locator("html")).toHaveAttribute("data-ui-color-scheme", "light");
		});
	});

	test.describe("sets color mode according to system preference", () => {
		test.use({ colorScheme: "light" });

		test("in light mode", async ({ page }) => {
			await page.goto("/en");
			await expect(page.locator("html")).toHaveAttribute("data-ui-color-scheme", "light");
		});
	});

	test.describe("sets color mode according to system preference", () => {
		test.use({ colorScheme: "dark" });

		test("in dark mode", async ({ page }) => {
			await page.goto("/en");
			await expect(page.locator("html")).toHaveAttribute("data-ui-color-scheme", "dark");
		});
	});
});
