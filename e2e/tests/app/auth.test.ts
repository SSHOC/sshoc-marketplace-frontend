import { createUrl } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";
import { expect, test } from "@/e2e/lib/test";
import { defaultLocale } from "@/lib/i18n/locales";

test.describe("auth", () => {
	test.use({ viewport: { width: 1920, height: 1280 } });

	test("should allow signing in with username and password", async ({ page }) => {
		await page.goto("http://localhost:3000/auth/sign-in");

		await page.getByRole("textbox", { name: "Username" }).click();
		await page.getByRole("textbox", { name: "Username" }).fill("Administrator");
		await page.getByRole("textbox", { name: "Username" }).press("Tab");
		await page.getByRole("textbox", { name: "Password" }).fill("q1w2e3r4t5");
		await page.getByRole("button", { name: "Sign in" }).press("Enter");

		await page.waitForURL("http://localhost:3000");
		expect(new URL(page.url()).pathname).toBe("/");

		await expect(page.getByRole("button", { name: "Hi, Administrator" })).toBeVisible();
	});

	test("should allow signing in with myaccessid", async ({ page }) => {
		await page.goto("http://localhost:3000/auth/sign-in");

		await page.getByRole("link", { name: "Sign in with MyAccessID" }).click();
		await page.getByText("Login with eduTEAMS Test IdP").click(); /** yes it's a div, not a link. */
	});
});
