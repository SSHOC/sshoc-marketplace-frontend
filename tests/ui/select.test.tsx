import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { Form } from "@/lib/core/form/Form";
import { FormSelect } from "@/lib/core/form/FormSelect";
import { Select } from "@/lib/core/ui/Select/Select";
import { SelectItem } from "@/lib/core/ui/Select/SelectItem";
import common from "@/messages/en/common.json";

// jsdom does not measure layout. The browser baseline exercises the real Virtualizer;
// these checks keep real RAC selection, labeling, validation and form behavior.
vi.mock("react-aria-components", async (importOriginal) => ({
	...(await importOriginal<typeof import("react-aria-components")>()),
	Virtualizer: ({ children }: { children: ReactNode }) => children,
}));

function mount(ui: ReactNode) {
	return render(
		<NextIntlClientProvider locale="en" messages={{ common }}>
			{ui}
		</NextIntlClientProvider>,
	);
}

const items = [
	{ code: "first", label: "First" },
	{ code: "blocked", label: "Blocked" },
	{ code: "last", label: "Last" },
];

describe("RAC Select", () => {
	it("preserves code identifiers, skips disabled options and supports native form serialization", async () => {
		const user = userEvent.setup();
		const changed = vi.fn();
		const { container } = mount(
			<form>
				<Select
					label="Service"
					name="service"
					items={items}
					defaultSelectedKey="first"
					disabledKeys={["blocked"]}
					onSelectionChange={changed}
				>
					{(item) => <SelectItem id={item.code}>{item.label}</SelectItem>}
				</Select>
			</form>,
		);
		const trigger = screen.getByRole("button", { name: /Service/ });
		expect(trigger.textContent).toContain("First");
		await user.click(trigger);
		expect(screen.getByRole("option", { name: "Blocked" }).getAttribute("aria-disabled")).toBe(
			"true",
		);
		await user.keyboard("{ArrowDown}{Enter}");
		await waitFor(() => expect(changed).toHaveBeenLastCalledWith("last"));
		expect(new FormData(container.querySelector("form")!).get("service")).toBe("last");
		await waitFor(() => expect(document.activeElement).toBe(trigger));
	});

	it("infers numeric ids in dynamic collections without converting the selected key to a string", async () => {
		const user = userEvent.setup();
		const changed = vi.fn();
		mount(
			<Select
				label="Category"
				items={[
					{ id: 7, label: "Seven" },
					{ id: 9, label: "Nine" },
				]}
				defaultSelectedKey={7}
				onSelectionChange={changed}
			>
				{(item) => <SelectItem>{item.label}</SelectItem>}
			</Select>,
		);
		const trigger = screen.getByRole("button", { name: /Category/ });
		expect(trigger.textContent).toContain("Seven");
		await user.click(trigger);
		await user.click(screen.getByRole("option", { name: "Nine" }));
		await waitFor(() => expect(changed).toHaveBeenLastCalledWith(9));
	});

	it("connects label, description and server validation errors to the trigger", async () => {
		mount(
			<Select
				label="Service"
				description="Pick the identifier provider"
				errorMessage="Service is required"
				validationState="invalid"
				isRequired
			>
				<SelectItem id="first">First</SelectItem>
			</Select>,
		);
		const trigger = screen.getByRole("button", { name: /Service/ });
		expect(screen.getByText("Service is required")).toBeTruthy();
		await waitFor(() => {
			const ids = trigger.getAttribute("aria-describedby")!.split(" ");
			const text = ids.map((id) => document.getElementById(id)?.textContent).join(" ");
			expect(text).toContain("Pick the identifier provider");
			expect(text).toContain("Service is required");
		});
	});

	it("commits a selection through Final Form and retains it while submission disables the control", async () => {
		const user = userEvent.setup();
		let finish!: () => void;
		const submitted = vi.fn(
			(_values: { service: string }) =>
				new Promise<void>((resolve) => {
					finish = resolve;
				}),
		);
		mount(
			<Form initialValues={{ service: "first" }} onSubmit={submitted}>
				<FormSelect name="service" label="Service">
					<SelectItem id="first">First</SelectItem>
					<SelectItem id="last">Last</SelectItem>
				</FormSelect>
				<button type="submit">Save</button>
			</Form>,
		);
		const trigger = screen.getByRole("button", { name: /Service/ });
		await user.click(trigger);
		await user.click(screen.getByRole("option", { name: "Last" }));
		await user.click(screen.getByRole("button", { name: "Save" }));
		expect(submitted.mock.calls[0]?.[0]).toEqual({ service: "last" });
		expect(trigger.hasAttribute("disabled")).toBe(true);
		finish();
		await waitFor(() => expect(trigger.hasAttribute("disabled")).toBe(false));
		expect(trigger.textContent).toContain("Last");
	});
});
