import { expect, test } from "@playwright/test";

import type { ItemSearch } from "@/data/sshoc/api/item";

import { fulfillLocalJson } from "./local-api";

test.use({ viewport: { width: 390, height: 844 } });

test("mobile facet selection updates results and Escape restores focus in order", async ({
	page,
}) => {
	const selectedKeyword = "Keyword 12";
	const keywords = Object.fromEntries(
		Array.from({ length: 12 }, (_, index) => [
			`Keyword ${String(index + 1).padStart(2, "0")}`,
			{ count: 1 },
		]),
	);
	const results: ItemSearch.Response["items"] = ["Matching dataset", "Other dataset"].map(
		(label, index) => ({
			label,
			category: "dataset",
			contributors: [],
			description: "",
			id: index + 1,
			lastInfoUpdate: "2026-01-01T00:00:00Z",
			owner: "fixture",
			persistentId: `fixture-${index + 1}`,
			properties: [],
			status: "approved",
		}),
	);

	await page.route("http://localhost:8080/api/item-search?**", (route) => {
		const query = new URL(route.request().url()).searchParams;
		const items = query.getAll("f.keyword").includes(selectedKeyword)
			? results.slice(0, 1)
			: results;
		return fulfillLocalJson(route, {
			items,
			count: items.length,
			hits: items.length,
			order: [],
			categories: {},
			facets: { activity: {}, keyword: keywords, language: {}, source: {} },
			page: 1,
			perpage: 20,
			pages: 1,
		});
	});
	await page.goto("/search");
	await expect(page.getByRole("link", { name: "Other dataset", exact: true })).toBeVisible();

	const refine = page.getByRole("button", { name: "Refine your search" });
	await refine.click();
	const dialog = page.getByRole("dialog", { name: "Refine your search" });
	const more = dialog.getByRole("button", { name: "More...", exact: true });
	await more.click();
	const less = dialog.getByRole("button", { name: "Less...", exact: true });
	await expect(less).toBeFocused();

	const keyword = dialog.getByRole("checkbox", { name: /^Keyword 12\b/ });
	await expect(keyword).toBeVisible();
	await keyword.press("Space");
	await expect(page).toHaveURL((url) =>
		url.searchParams.getAll("f.keyword").includes(selectedKeyword),
	);
	await expect(keyword).toBeChecked();

	await page.keyboard.press("Escape");
	await expect(dialog).toBeVisible();
	await expect(more).toBeFocused();
	await page.keyboard.press("Escape");
	await expect(dialog).toBeHidden();
	await expect(refine).toBeFocused();
	await expect(page.getByRole("link", { name: "Matching dataset", exact: true })).toBeVisible();
	await expect(page.getByRole("link", { name: "Other dataset", exact: true })).toHaveCount(0);
});
