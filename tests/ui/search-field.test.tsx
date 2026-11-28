import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { expect, it, vi } from "vitest";

import { SearchField } from "@/lib/core/ui/SearchField/SearchField";
import common from "@/messages/en/common.json";

it("submits the search query and clears it without losing input focus", async () => {
	const user = userEvent.setup();
	const submit = vi.fn();
	const clear = vi.fn();
	render(
		<NextIntlClientProvider locale="en" messages={{ common }}>
			<SearchField aria-label="Search actors" onSubmit={submit} onClear={clear} />
		</NextIntlClientProvider>,
	);
	const input = screen.getByRole<HTMLInputElement>("searchbox", { name: "Search actors" });
	await user.type(input, "Smith{Enter}");
	expect(submit.mock.calls).toEqual([["Smith"]]);
	await user.click(screen.getByRole("button", { name: "Clear search" }));
	expect(input.value).toBe("");
	expect(document.activeElement).toBe(input);
	await user.type(input, "Jones{Escape}");
	expect(input.value).toBe("");
	expect(clear).toHaveBeenCalledTimes(2);
	expect(submit).toHaveBeenCalledTimes(1);
});
