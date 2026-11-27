import { expect, test } from "@playwright/test";

import type { Actor } from "@/data/sshoc/api/actor";
import type { Dataset, DatasetInput } from "@/data/sshoc/api/dataset";
import type { User } from "@/data/sshoc/api/user";

import { fulfillLocalJson } from "./local-api";

const apiOrigin = "http://localhost:8080";
const user: User = {
	id: 1,
	username: "browser-fixture",
	displayName: "Browser fixture",
	email: "browser-fixture@example.test",
	role: "moderator",
	status: "enabled",
	registrationDate: "2026-01-01T00:00:00Z",
	config: false,
};
const savedActor: Actor = {
	id: 732,
	name: "Jordan Example",
	affiliations: [{ id: 733, name: "Saved affiliation", affiliations: [], externalIds: [] }],
	externalIds: [],
};
const sameNameActor: Actor = {
	...savedActor,
	id: 731,
	affiliations: [{ id: 734, name: "Other affiliation", affiliations: [], externalIds: [] }],
};
const dataset: Dataset = {
	id: 1,
	persistentId: "browser-fixture",
	category: "dataset",
	label: "Fixture dataset",
	description: "Dataset with a saved actor.",
	lastInfoUpdate: "2026-01-01T00:00:00Z",
	status: "approved",
	informationContributor: user,
	contributors: [{ actor: savedActor, role: { code: "author", label: "Author", ord: 1 } }],
	properties: [],
	externalIds: [],
	accessibleAt: ["https://example.test/original"],
	relatedItems: [],
	media: [],
};

test("an edit form preserves a saved actor ID across virtualized loading and upload cancellation", async ({
	page,
}) => {
	// A synthetic session is accepted only by the browser fixture routes below.
	const expiration = Math.floor(Date.now() / 1000) + 3600;
	const token = `Bearer fixture.${Buffer.from(JSON.stringify({ exp: expiration })).toString("base64url")}.fixture`;
	await page.addInitScript((value) => localStorage.setItem("__sshoc_token__", value), token);

	const requestedPages: number[] = [];
	const saves: DatasetInput[] = [];
	let releaseNextPage!: () => void;
	const nextPageGate = new Promise<void>((resolve) => {
		releaseNextPage = resolve;
	});
	const firstPage = [
		sameNameActor,
		savedActor,
		...Array.from({ length: 28 }, (_, index): Actor => ({
			id: 800 + index,
			name: `Page one actor ${index + 1}`,
			affiliations: [],
			externalIds: [],
		})),
	];
	const lastActor: Actor = { id: 831, name: "Page two actor", affiliations: [], externalIds: [] };

	await page.route("**/api/**", async (route) => {
		const url = new URL(route.request().url());
		const method = route.request().method();
		if (url.origin !== apiOrigin) return route.abort();
		switch (url.pathname) {
			case "/api/auth/me":
				return fulfillLocalJson(route, user);
			case "/api/datasets/browser-fixture":
				if (method === "PUT") saves.push(route.request().postDataJSON() as DatasetInput);
				return fulfillLocalJson(route, dataset);
			case "/api/actors/732":
				return fulfillLocalJson(route, savedActor);
			case "/api/items-categories":
				return fulfillLocalJson(route, { dataset: "Dataset" });
			case "/api/property-types":
				return fulfillLocalJson(route, { propertyTypes: [], hits: 0, count: 0, page: 1, pages: 1 });
			case "/api/actor-roles":
				return fulfillLocalJson(route, [dataset.contributors[0]!.role]);
			case "/api/actor-search": {
				const query = url.searchParams.get("q");
				const currentPage = Number(url.searchParams.get("page") ?? 1);
				if (query === savedActor.name) {
					requestedPages.push(currentPage);
					if (currentPage === 2) await nextPageGate;
				}
				const actors = currentPage === 2 ? [lastActor] : firstPage;
				return fulfillLocalJson(route, {
					actors,
					hits: 31,
					count: actors.length,
					page: currentPage,
					perpage: 30,
					pages: 2,
				});
			}
			case "/api/concept-search":
				return fulfillLocalJson(route, { concepts: [], hits: 0, count: 0, page: 1, pages: 1 });
			default:
				return route.abort();
		}
	});

	await page.goto("/dataset/browser-fixture/edit", { waitUntil: "domcontentloaded" });
	const title = page.locator('input[name="label"]');
	await expect(title).toHaveValue(dataset.label);
	const actor = page.getByRole("combobox", { name: /^Name/ });
	await expect(actor).toHaveValue(savedActor.name);
	await actor.scrollIntoViewIfNeeded();
	await actor.press("ArrowDown");
	const list = page.getByRole("listbox");
	const savedOption = list.getByRole("option").filter({ hasText: "Saved affiliation" });
	const otherOption = list.getByRole("option").filter({ hasText: "Other affiliation" });
	await expect(savedOption).toHaveAttribute("aria-selected", "true");
	await expect(otherOption).toHaveAttribute("aria-selected", "false");

	try {
		await list.evaluate((element) => {
			element.scrollTop = element.scrollHeight;
		});
		await expect.poll(() => requestedPages).toEqual([1, 2]);
		await expect(list.getByRole("progressbar", { name: "Loading more..." })).toBeVisible();
	} finally {
		releaseNextPage();
	}
	await expect(list.getByRole("progressbar")).toHaveCount(0);
	await list.evaluate((element) => {
		element.scrollTop = element.scrollHeight;
	});
	await expect(list.getByRole("option", { name: lastActor.name })).toBeInViewport();
	await actor.press("Escape");
	await expect(actor).toHaveValue(savedActor.name);

	await title.fill("Unsaved edit");
	const urls = page.locator('input[name^="accessibleAt["]');
	await urls.first().fill("https://example.test/unsaved");
	await title.evaluate((element) => {
		element.closest("form")?.addEventListener("submit", (event) => {
			(event.currentTarget as HTMLFormElement).dataset["submitted"] = "true";
		});
	});
	const launcher = page.getByRole("button", { name: "Add Media", exact: true });
	await launcher.click();
	const dialog = page.getByRole("dialog", { name: "Upload media" });
	await expect(dialog).toBeVisible();
	const png = Buffer.from(
		"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a4foAAAAASUVORK5CYII=",
		"base64",
	);
	await dialog.locator('input[type="file"][name="file"]').setInputFiles({
		name: "cancelled-upload.png",
		mimeType: "image/png",
		buffer: png,
	});
	await expect(dialog.getByText(/cancelled-upload\.png/)).toBeVisible();
	await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
	await expect(dialog).toBeHidden();
	await expect(launcher).toBeFocused();
	await expect(title).toHaveValue("Unsaved edit");
	await expect(urls.first()).toHaveValue("https://example.test/unsaved");
	await expect(title.locator("xpath=ancestor::form")).not.toHaveAttribute("data-submitted");
	expect(saves).toEqual([]);

	await page.getByRole("button", { name: "Publish", exact: true }).click();
	await expect.poll(() => saves.length).toBe(1);
	expect(saves[0]?.contributors).toEqual([
		{ actor: { id: savedActor.id }, role: { code: "author" } },
	]);
});
