import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { expect, it } from "vitest";

import { CopyLinkToClipboardButton as ItemCopyButton } from "@/components/item/CopyLinkToClipboardButton";
import { CopyLinkToClipboardButton as SearchCopyButton } from "@/components/search/CopyLinkToClipboardButton";
import { createSiteUrl } from "@/lib/utils";
import common from "@/messages/en/common.json";

it("copies item links from both the search and detail buttons", async () => {
	const user = userEvent.setup();
	const name = common.search["copy-to-clipboard"];

	render(
		<NextIntlClientProvider locale="en" messages={{ common }}>
			<section aria-label="Search result">
				<SearchCopyButton href={{ pathname: "/dataset/search-result" }} />
			</section>
			<section aria-label="Item details">
				<ItemCopyButton pathname="/dataset/item-details" />
			</section>
		</NextIntlClientProvider>,
	);

	const searchButton = within(screen.getByRole("region", { name: "Search result" })).getByRole(
		"button",
		{ name },
	);
	await user.tab();
	expect(document.activeElement).toBe(searchButton);
	await user.keyboard("{Enter}");
	expect(await navigator.clipboard.readText()).toBe(
		String(createSiteUrl({ pathname: "/dataset/search-result" })),
	);

	const itemButton = within(screen.getByRole("region", { name: "Item details" })).getByRole(
		"button",
		{ name },
	);
	await user.click(itemButton);
	expect(await navigator.clipboard.readText()).toBe(
		String(createSiteUrl({ pathname: "/dataset/item-details" })),
	);
});
