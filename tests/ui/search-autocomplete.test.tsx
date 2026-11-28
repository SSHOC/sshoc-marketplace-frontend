import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { expect, it, vi } from "vitest";

import { ListBoxItem } from "@/lib/core/ui/ListBox/ListBoxItem";
import { SearchAutocomplete } from "@/lib/core/ui/SearchAutocomplete/SearchAutocomplete";
import common from "@/messages/en/common.json";

// jsdom has no layout, so exercise the real collection without virtualization.
vi.mock("react-aria-components", async (importOriginal) => ({
	...(await importOriginal<typeof import("react-aria-components")>()),
	Virtualizer: ({ children }: { children: ReactNode }) => children,
}));

it("submits free text and keyboard-selected suggestions without submitting the parent form", async () => {
	const user = userEvent.setup();
	const submit = vi.fn();
	const formSubmit = vi.fn((event: { preventDefault(): void }) => event.preventDefault());
	render(
		<NextIntlClientProvider locale="en" messages={{ common }}>
			<form onSubmit={formSubmit}>
				<SearchAutocomplete aria-label="Search items" name="q" onSubmit={submit}>
					<ListBoxItem id="dataset">Dataset</ListBoxItem>
				</SearchAutocomplete>
			</form>
		</NextIntlClientProvider>,
	);
	const input = screen.getByRole("combobox", { name: "Search items" });
	await user.type(input, "unknown{Enter}");
	expect(submit.mock.calls).toEqual([["unknown", null]]);
	await user.click(screen.getByRole("button", { name: "Clear" }));
	expect((input as HTMLInputElement).value).toBe("");
	expect(document.activeElement).toBe(input);
	await user.type(input, "data{ArrowDown}{Enter}");
	expect(submit.mock.calls).toEqual([
		["unknown", null],
		[null, "dataset"],
	]);
	await user.clear(input);
	await user.type(input, "data");
	await user.click(screen.getByRole("option", { name: "Dataset" }));
	expect(submit).toHaveBeenCalledTimes(3);
	expect(submit).toHaveBeenLastCalledWith(null, "dataset");
	expect(formSubmit).not.toHaveBeenCalled();
});
