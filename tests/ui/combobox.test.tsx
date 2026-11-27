import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Form } from "@/lib/core/form/Form";
import { FormComboBox } from "@/lib/core/form/FormComboBox";
import { ComboBox } from "@/lib/core/ui/ComboBox/ComboBox";
import { ListBoxItem } from "@/lib/core/ui/ListBox/ListBoxItem";
import common from "@/messages/en/common.json";

// Real collection/focus/form behavior; the Playwright baseline exercises virtual layout.
vi.mock("react-aria-components", async (importOriginal) => ({
	...(await importOriginal<typeof import("react-aria-components")>()),
	Virtualizer: ({ children }: { children: ReactNode }) => children,
}));

function mount(ui: ReactNode) {
	return render(ui, {
		wrapper: ({ children }) => (
			<NextIntlClientProvider locale="en" messages={{ common }}>
				{children}
			</NextIntlClientProvider>
		),
	});
}

const people = [
	{ id: 1, name: "José" },
	{ id: 2, name: "Joseph" },
	{ id: 3, name: "Anna" },
];

describe("RAC ComboBox", () => {
	it("filters default items, skips disabled options and retains focus on the input after keyboard selection", async () => {
		const user = userEvent.setup();
		const selected = vi.fn();
		mount(
			<ComboBox
				label="Person"
				defaultItems={people}
				disabledKeys={[2]}
				onSelectionChange={selected}
			>
				{(item) => <ListBoxItem>{item.name}</ListBoxItem>}
			</ComboBox>,
		);
		const input = screen.getByRole("combobox", { name: "Person" });
		await user.type(input, "jose");
		expect(screen.queryByRole("option", { name: "Anna" })).toBeNull();
		expect(screen.getByRole("option", { name: "Joseph" }).getAttribute("aria-disabled")).toBe(
			"true",
		);
		await user.keyboard("{ArrowDown}{Enter}");
		await waitFor(() => expect(selected).toHaveBeenLastCalledWith(1));
		expect((input as HTMLInputElement).value).toBe("José");
		expect(document.activeElement).toBe(input);
	});

	it("keeps externally supplied results unfiltered and exposes async loading and empty states", async () => {
		const user = userEvent.setup();
		const selected = vi.fn();
		function Search({
			loadingState,
			items,
		}: {
			loadingState: "loading" | "idle";
			items: typeof people;
		}) {
			const [value, setValue] = useState("");
			return (
				<ComboBox
					label="Person"
					inputValue={value}
					onInputChange={setValue}
					items={items}
					loadingState={loadingState}
					onSelectionChange={selected}
				>
					{(item) => <ListBoxItem>{item.name}</ListBoxItem>}
				</ComboBox>
			);
		}
		const { rerender } = mount(<Search loadingState="loading" items={[]} />);
		const input = screen.getByRole("combobox", { name: "Person" });
		await user.type(input, "server query");
		expect(screen.getByText("Loading...")).toBeTruthy();
		rerender(<Search loadingState="idle" items={[]} />);
		expect(screen.getByText("No results found")).toBeTruthy();
		rerender(<Search loadingState="idle" items={[people[0]!]} />);
		await user.click(screen.getByRole("option", { name: "José" }));
		await waitFor(() => expect(selected).toHaveBeenLastCalledWith(1));
		expect((input as HTMLInputElement).value).toBe("José");
	});

	it("associates descriptions and validation errors and disables both input and trigger", async () => {
		const { rerender } = mount(
			<ComboBox
				label="Person"
				description="Choose a contributor"
				errorMessage="Choose a person"
				validationState="invalid"
				isRequired
			>
				<ListBoxItem id="one">One</ListBoxItem>
			</ComboBox>,
		);
		const input = screen.getByRole("combobox", { name: /Person/ });
		expect(input.getAttribute("aria-invalid")).toBe("true");
		await waitFor(() => {
			const text = input
				.getAttribute("aria-describedby")!
				.split(" ")
				.map((id) => document.getElementById(id)?.textContent)
				.join(" ");
			expect(text).toContain("Choose a contributor");
			expect(text).toContain("Choose a person");
		});
		rerender(
			<ComboBox label="Person" isDisabled>
				<ListBoxItem id="one">One</ListBoxItem>
			</ComboBox>,
		);
		expect(input.hasAttribute("disabled")).toBe(true);
		expect(screen.getByRole("button", { name: /Show suggestions/ }).hasAttribute("disabled")).toBe(
			true,
		);
	});

	it("focuses the named editable input when Final Form rejects a required selection", async () => {
		const user = userEvent.setup();
		const submitted = vi.fn();
		mount(
			<Form
				initialValues={{ person: null }}
				onSubmit={submitted}
				validate={() => ({ person: "Choose a person" })}
			>
				<FormComboBox label="Person" name="person" isRequired items={people}>
					{(item) => <ListBoxItem>{item.name}</ListBoxItem>}
				</FormComboBox>
				<button type="submit">Save</button>
			</Form>,
		);
		const input = screen.getByRole("combobox", { name: /Person/ });
		await user.click(screen.getByRole("button", { name: "Save" }));
		await waitFor(() => expect(document.activeElement).toBe(input));
		expect(input.getAttribute("name")).toBe("person");
		expect(submitted).not.toHaveBeenCalled();
	});

	it("submits numeric selections through Final Form and clears the selected key when the input is cleared", async () => {
		const user = userEvent.setup();
		const submitted = vi.fn((_values: { person?: number | null }) => {});
		mount(
			<Form initialValues={{ person: 1 }} onSubmit={submitted}>
				<FormComboBox label="Person" name="person" items={people}>
					{(item) => <ListBoxItem>{item.name}</ListBoxItem>}
				</FormComboBox>
				<button type="submit">Save</button>
			</Form>,
		);
		const input = screen.getByRole("combobox", { name: "Person" });
		expect((input as HTMLInputElement).value).toBe("José");
		await user.click(screen.getByRole("button", { name: /Show suggestions/ }));
		await user.click(screen.getByRole("option", { name: "Anna" }));
		await user.click(screen.getByRole("button", { name: "Save" }));
		expect(submitted.mock.calls[0]?.[0]).toEqual({ person: 3 });
		await user.clear(input);
		await user.click(screen.getByRole("button", { name: "Save" }));
		expect(submitted.mock.calls.at(-1)?.[0]).toEqual({ person: null });
	});
});
