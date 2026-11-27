import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { expect, it } from "vitest";

import { ItemAccessibleAtLinks } from "@/components/item/ItemAccessibleAtLinks";
import common from "@/messages/en/common.json";

it("opens multiple access links by keyboard and restores focus when dismissed", async () => {
	const user = userEvent.setup();
	const links = ["https://example.test/first", "https://example.test/second"];
	render(
		<NextIntlClientProvider locale="en" messages={{ common }}>
			<ItemAccessibleAtLinks category="dataset" links={links} />
		</NextIntlClientProvider>,
	);
	const button = screen.getByRole("button");
	await user.tab();
	await user.keyboard("{ArrowDown}");
	const first = screen.getByRole("menuitem", { name: links[0] });
	const second = screen.getByRole("menuitem", { name: links[1] });
	await waitFor(() => expect(document.activeElement).toBe(first));
	await user.keyboard("{ArrowDown}");
	expect(document.activeElement).toBe(second);
	expect(second.getAttribute("href")).toBe(links[1]);
	expect(second.getAttribute("target")).toBe("_blank");
	await user.keyboard("{Escape}");
	await waitFor(() => expect(document.activeElement).toBe(button));
	expect(screen.queryByRole("menu")).toBeNull();
});
