import { createUrl } from "@acdh-oeaw/lib";
import { expect, test } from "@playwright/test";

import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";

test.describe("i18n", () => {
	test.describe("redirects root route to preferred locale", () => {
		test.use({ locale: "en" });

		test("with default locale", async ({ page }) => {
			await page.goto("/");
			await expect(page).toHaveURL("/en");
		});
	});

	test.describe("redirects root route to preferred locale", () => {
		test.use({ locale: "de" });

		test("with supported locale", async ({ page }) => {
			await page.goto("/");
			await expect(page).toHaveURL("/de");
		});
	});

	test.describe("redirects root route to preferred locale", () => {
		test.use({ locale: "fr" });

		test("with unsupported locale", async ({ page }) => {
			await page.goto("/");
			await expect(page).toHaveURL("/en");
		});
	});

	test("displays not-found page for unknown locale", async ({ page }) => {
		const response = await page.goto("/unknown");
		expect(response?.status()).toBe(404);
		await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
	});

	test("displays localised not-found page for unknown pathname", async ({ page }) => {
		const _response = await page.goto("/de/unknown");
		/**
		 * When streaming a response, because the root layout has a suspense boundary
		 * or a `loading.tsx`, the response status code will always be 200.
		 *
		 * @see https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#status-codes
		 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
		 */
		// expect(response?.status()).toBe(404);
		await expect(page.getByRole("heading", { name: "Seite nicht gefunden" })).toBeVisible();
	});

	test("supports switching locale", async ({ page }) => {
		await page.goto("/de/imprint");
		await expect(page).toHaveURL("/de/imprint");
		await expect(page.getByRole("heading", { name: "Impressum" })).toBeVisible();
		await expect(page).toHaveTitle("Impressum | Social Sciences & Humanities Open Marketplace");

		await page.getByRole("link", { name: "Zu Englisch wechseln" }).click();

		await expect(page).toHaveURL("/en/imprint");
		await expect(page.getByRole("heading", { name: "Imprint" })).toBeVisible();
		await expect(page).toHaveTitle("Imprint | Social Sciences & Humanities Open Marketplace");
	});

	test("sets `lang` attribute on `html` element", async ({ page }) => {
		for (const locale of locales) {
			await page.goto(`/${locale}`);
			await expect(page.locator("html")).toHaveAttribute("lang", locale);
		}
	});

	test("sets alternate links in response header", async ({ page }) => {
		function createAbsoluteUrl(pathname: string) {
			return String(createUrl({ baseUrl: env.NEXT_PUBLIC_APP_BASE_URL, pathname }));
		}

		for (const locale of locales) {
			const response = await page.goto(`/${locale}`);
			expect(response?.headers().link?.split(", ")).toEqual([
				`<${createAbsoluteUrl("/de")}>; rel="alternate"; hreflang="de"`,
				`<${createAbsoluteUrl("/en")}>; rel="alternate"; hreflang="en"`,
				`<${createAbsoluteUrl("/")}>; rel="alternate"; hreflang="x-default"`,
			]);
		}

		for (const locale of locales) {
			const response = await page.goto(`/${locale}/imprint`);
			expect(response?.headers().link?.split(", ")).toEqual([
				`<${createAbsoluteUrl("/de/imprint")}>; rel="alternate"; hreflang="de"`,
				`<${createAbsoluteUrl("/en/imprint")}>; rel="alternate"; hreflang="en"`,
				`<${createAbsoluteUrl("/imprint")}>; rel="alternate"; hreflang="x-default"`,
			]);
		}
	});
});
