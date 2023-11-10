import { createUrl } from "@acdh-oeaw/lib";
import { expect, test } from "@playwright/test";

import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";

test("sets a canonical url", async ({ page }) => {
	for (const locale of locales) {
		await page.goto(`/${locale}`);

		const canonicalUrl = page.locator('link[rel="canonical"]');
		await expect(canonicalUrl).toHaveAttribute(
			"href",
			String(createUrl({ baseUrl: env.NEXT_PUBLIC_APP_BASE_URL, pathname: `/${locale}` })),
		);
	}
});

/** FIXME: @see https://github.com/vercel/next.js/issues/45620 */
test.fixme("sets document title on not-found page", async ({ page }) => {
	await page.goto("/unknown");
	await expect(page).toHaveTitle("Page not found | Social Sciences & Humanities Open Marketplace");

	await page.goto("/de/unknown");
	await expect(page).toHaveTitle(
		"Seite nicht gefunden | Social Sciences & Humanities Open Marketplace",
	);
});

/** FIXME: @see https://github.com/vercel/next.js/issues/45620 */
test.fixme("disallows indexing of not-found page", async ({ page }) => {
	for (const pathname of ["/unknown", "/de/unknown"]) {
		await page.goto(pathname);

		const ogTitle = page.locator('meta[name="robots"]');
		await expect(ogTitle).toHaveAttribute("content", "nofollow, noindex");
	}
});

test.describe("sets page metadata", () => {
	test("static", async ({ page }) => {
		await page.goto("/en");

		const ogType = page.locator('meta[property="og:type"]');
		await expect(ogType).toHaveAttribute("content", "website");

		const twCard = page.locator('meta[name="twitter:card"]');
		await expect(twCard).toHaveAttribute("content", "summary_large_image");

		const twCreator = page.locator('meta[name="twitter:creator"]');
		await expect(twCreator).toHaveAttribute("content", "@sshopencloud");

		const twSite = page.locator('meta[name="twitter:site"]');
		await expect(twSite).toHaveAttribute("content", "@sshopencloud");

		// const googleSiteVerification = page.locator('meta[name="google-site-verification"]');
		// await expect(googleSiteVerification).toHaveAttribute("content", "");
	});

	test("with en locale", async ({ page }) => {
		await page.goto("/en");

		await expect(page).toHaveTitle("Social Sciences & Humanities Open Marketplace");

		const metaDescription = page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveAttribute(
			"content",
			"Discover new resources for your research in Social Sciences and Humanities: tools, services, training materials and datasets, contextualised.",
		);

		const ogTitle = page.locator('meta[property="og:title"]');
		await expect(ogTitle).toHaveAttribute(
			"content",
			"Social Sciences & Humanities Open Marketplace",
		);

		const ogDescription = page.locator('meta[property="og:description"]');
		await expect(ogDescription).toHaveAttribute(
			"content",
			"Discover new resources for your research in Social Sciences and Humanities: tools, services, training materials and datasets, contextualised.",
		);

		const ogUrl = page.locator('meta[property="og:url"]');
		await expect(ogUrl).toHaveAttribute(
			"content",
			String(createUrl({ baseUrl: env.NEXT_PUBLIC_APP_BASE_URL, pathname: "/en" })),
		);

		const ogLocale = page.locator('meta[property="og:locale"]');
		await expect(ogLocale).toHaveAttribute("content", "en");
	});

	test("with de locale", async ({ page }) => {
		await page.goto("/de");

		await expect(page).toHaveTitle("Social Sciences & Humanities Open Marketplace");

		const metaDescription = page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveAttribute(
			"content",
			"Neue sozial- und geisteswissenschaftliche Ressourcen entdecken: Werkzeuge, Dienste, Trainingsmaterialien und Daten, kontextualisiert.",
		);

		const ogTitle = page.locator('meta[property="og:title"]');
		await expect(ogTitle).toHaveAttribute(
			"content",
			"Social Sciences & Humanities Open Marketplace",
		);

		const ogDescription = page.locator('meta[property="og:description"]');
		await expect(ogDescription).toHaveAttribute(
			"content",
			"Neue sozial- und geisteswissenschaftliche Ressourcen entdecken: Werkzeuge, Dienste, Trainingsmaterialien und Daten, kontextualisiert.",
		);

		const ogUrl = page.locator('meta[property="og:url"]');
		await expect(ogUrl).toHaveAttribute(
			"content",
			String(createUrl({ baseUrl: env.NEXT_PUBLIC_APP_BASE_URL, pathname: "/de" })),
		);

		const ogLocale = page.locator('meta[property="og:locale"]');
		await expect(ogLocale).toHaveAttribute("content", "de");
	});
});

test.describe("adds json+ld metadata", () => {
	test("with en locale", async ({ page }) => {
		await page.goto("/en");

		await expect(page.locator('script[type="application/ld+json"]')).toHaveText(
			'{"@context":"https://schema.org","@type":"WebSite","name":"Social Sciences & Humanities Open Marketplace","description":"Discover new resources for your research in Social Sciences and Humanities: tools, services, training materials and datasets, contextualised."}',
		);
	});

	test("with de locale", async ({ page }) => {
		await page.goto("/en");

		await expect(page.locator('script[type="application/ld+json"]')).toHaveText(
			'{"@context":"https://schema.org","@type":"WebSite","name":"Social Sciences & Humanities Open Marketplace","description":"Neue sozial- und geisteswissenschaftliche Ressourcen entdecken: Werkzeuge, Dienste, Trainingsmaterialien und Daten, kontextualisiert."}',
		);
	});
});

test("serves an open-graph image", async ({ request }) => {
	for (const locale of locales) {
		const response = await request.get(`/${locale}/opengraph-image.png`);
		const status = response.status();

		expect(status).toEqual(200);
	}
});
