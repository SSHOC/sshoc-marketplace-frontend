import { expect, type Locator, test } from "@playwright/test";

// Supplied at runtime, never committed or saved as browser storage state.
// Test credentials are intentionally separate from the application environment schema.
// oxlint-disable-next-line no-restricted-properties
const username = process.env.E2E_USERNAME;
// oxlint-disable-next-line no-restricted-properties
const password = process.env.E2E_PASSWORD;
const apiOrigin = "http://localhost:8080";

test("local dataset form: validate, edit repeatable URLs, recover from failed save and persist", async ({
	page,
}, testInfo) => {
	test.skip(
		!username || !password,
		"Set E2E_USERNAME and E2E_PASSWORD for a local moderator account.",
	);
	// Fail closed if the frontend configuration ever points API traffic outside this local test.
	await page.route("**/api/**", async (route) => {
		const url = new URL(route.request().url());
		if (![apiOrigin, "http://127.0.0.1:3117"].includes(url.origin)) {
			await route.abort();
			throw new Error(`Refusing non-local API request: ${url.origin}`);
		}
		await route.fallback();
	});
	await page.goto("/auth/sign-in");
	await page.locator('input[name="username"]').fill(username!);
	await page.locator('input[name="password"]').fill(password!);
	const signIn = page.waitForResponse(
		(response) => response.url() === `${apiOrigin}/api/auth/sign-in`,
	);
	await page.locator("form").getByRole("button", { name: "Sign in", exact: true }).click();
	expect((await signIn).status()).toBe(200);
	await expect(page).not.toHaveURL(/auth\/sign-in/, { timeout: 30_000 });
	await page.goto("/dataset/new");

	const label = page.locator('input[name="label"]');
	const description = page.locator('textarea[name="description"]');
	const urls = page.locator('input[name^="accessibleAt["]');
	const publish = page.getByRole("button", { name: "Publish", exact: true });
	await expect(publish).toBeVisible();

	// Exercise the virtualized select with keyboard navigation, then discard the optional row.
	const service = page.getByRole("button", { name: /ID Service/ });
	await scrollToField(service);
	await service.click();
	const firstService = page.getByRole("option").first();
	await expect(firstService).toBeVisible();
	const serviceLabel = await firstService.innerText();
	await page.getByRole("listbox").press("End");
	await expect(page.getByRole("option").last()).toBeFocused();
	await page.keyboard.press("Home");
	await expect(firstService).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(service).toContainText(serviceLabel);
	await page.getByRole("button", { name: "Remove External ID", exact: true }).first().click();

	// Async combo boxes must keep their empty state and allow selecting a loaded result.
	const actor = page.getByRole("combobox", { name: /^Name/ });
	await scrollToField(actor);
	await actor.fill("zzzz-no-actor-regression-test");
	await expect(page.getByText("No results found", { exact: true })).toBeVisible();
	await actor.fill("Smith");
	const firstActor = page.getByRole("option").first();
	await expect(firstActor).toContainText("Smith");
	const actorName = (await firstActor.innerText()).split("\n")[0]!;
	await actor.press("ArrowDown");
	await expect(actor).toHaveAttribute("aria-activedescendant", /.+/);
	await actor.press("Enter");
	await expect(actor).toHaveValue(actorName);
	await expect(page.getByRole("listbox")).not.toBeVisible();
	await page.getByRole("button", { name: "Remove Actor", exact: true }).first().click();

	await urls.first().fill("not-a-url");
	await publish.click();
	await expect(label).toHaveAttribute("aria-invalid", "true");
	await expect(label).toBeFocused();
	await expect(urls.first()).toHaveAttribute("aria-invalid", "true");

	const title = `Final Form baseline ${Date.now()}`;
	await label.fill(title);
	await description.fill(
		"Disposable local form regression baseline; safe to remove after testing.",
	);
	await urls.first().fill("https://example.test/first");
	await page.getByRole("button", { name: "Add Accessible at URL", exact: true }).click();
	await urls.nth(1).fill("https://example.test/remove");
	await page.getByRole("button", { name: "Add Accessible at URL", exact: true }).click();
	await urls.nth(2).fill("https://example.test/last");
	await page.getByRole("button", { name: "Remove Accessible at URL", exact: true }).first().click();
	await expect(urls).toHaveCount(2);
	await urls.first().fill("https://example.test/edited");
	const expectedUrls = ["https://example.test/edited", "https://example.test/last"];

	let releaseFailure!: () => void;
	const failureGate = new Promise<void>((resolve) => {
		releaseFailure = resolve;
	});
	await page.route(
		`${apiOrigin}/api/datasets`,
		async (route) => {
			if (route.request().method() !== "POST") return route.fallback();
			await failureGate;
			await route.fulfill({
				status: 500,
				contentType: "application/json",
				body: JSON.stringify({ error: "Baseline simulated save failure" }),
				headers: {
					"access-control-allow-origin": "http://127.0.0.1:3117",
					"access-control-allow-credentials": "true",
				},
			});
		},
		{ times: 1 },
	);
	await publish.click();
	await expect(publish).toBeDisabled();
	await expect(label).toBeDisabled();
	await expect(page.locator(".Toastify__spinner")).toBeVisible();
	releaseFailure();
	await expect(page.getByText(/Last submission failed/)).toBeVisible();
	await expect(publish).toBeEnabled();
	const errorToast = page.locator(".Toastify__toast--error").last();
	await expect(errorToast).toBeVisible();
	await errorToast.getByRole("button", { name: /close/i }).click();
	await expect(label).toHaveValue(title);
	await expect(urls.first()).toHaveValue(expectedUrls[0]!);
	await expect(urls.nth(1)).toHaveValue(expectedUrls[1]!);

	const createdResponse = page.waitForResponse(
		(response) =>
			response.url() === `${apiOrigin}/api/datasets` && response.request().method() === "POST",
	);
	await publish.click();
	const created = await createdResponse;
	expect(created.ok()).toBe(true);
	const dataset = await created.json();
	expect(dataset.label).toBe(title);
	expect(dataset.accessibleAt).toEqual(expectedUrls);
	expect(dataset.status).toBe("approved");
	await expect(page.locator(".Toastify__toast--success").last()).toBeVisible();
	await testInfo.attach("created-local-item", {
		body: JSON.stringify({ persistentId: dataset.persistentId, title }),
		contentType: "application/json",
	});
	await expect(page).toHaveURL(new RegExp(`/dataset/${dataset.persistentId}$`));

	await page.goto(`/dataset/${dataset.persistentId}/edit`);
	await expect(label).toHaveValue(title);
	await expect(urls).toHaveCount(2);
	await expect(urls.first()).toHaveValue(expectedUrls[0]!);
	await expect(urls.nth(1)).toHaveValue(expectedUrls[1]!);
	await label.fill(`${title} edited`);
	const updateResponse = page.waitForResponse(
		(response) =>
			new URL(response.url()).origin === apiOrigin &&
			new URL(response.url()).pathname === `/api/datasets/${dataset.persistentId}` &&
			response.request().method() === "PUT",
	);
	await publish.click();
	expect((await updateResponse).ok()).toBe(true);
	await expect(page).toHaveURL(new RegExp(`/dataset/${dataset.persistentId}$`));
	await page.goto(`/dataset/${dataset.persistentId}/edit`);
	await expect(label).toHaveValue(`${title} edited`);
	await expect(urls.first()).toHaveValue(expectedUrls[0]!);
	await expect(urls.nth(1)).toHaveValue(expectedUrls[1]!);
});

async function scrollToField(field: Locator) {
	await field.evaluate((element) =>
		element.scrollIntoView({ block: "center", behavior: "instant" }),
	);
	// Let scrolling finish before opening: overlays close on ancestor scrolling.
	await field.evaluate(
		() =>
			new Promise<void>((resolve) =>
				requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
			),
	);
}
