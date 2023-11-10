import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("imprint page", () => {
	test("should have document title", async ({ page }) => {
		await page.goto("/en/imprint");
		await expect(page).toHaveTitle("Imprint | Social Sciences & Humanities Open Marketplace");

		await page.goto("/de/imprint");
		await expect(page).toHaveTitle("Impressum | Social Sciences & Humanities Open Marketplace");
	});

	test("should have imprint text", async ({ page }) => {
		await page.goto("/en/imprint");
		await expect(page.getByRole("main")).toContainText("Legal disclosure");

		await page.goto("/de/imprint");
		await expect(page.getByRole("main")).toContainText("Offenlegung");
	});

	test("should not have any automatically detectable accessibility issues", async ({ page }) => {
		await page.goto("/en/imprint");
		expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

		await page.goto("/de/imprint");
		expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
	});
});
