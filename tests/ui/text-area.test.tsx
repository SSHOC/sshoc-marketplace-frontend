import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { expect, it, vi } from "vitest";

import { TextArea } from "@/lib/core/ui/TextField/TextArea";
import common from "@/messages/en/common.json";

it("connects textarea labels and errors while preserving native callbacks and form values", async () => {
	const user = userEvent.setup();
	const onCopy = vi.fn();
	render(
		<NextIntlClientProvider locale="en" messages={{ common }}>
			<form aria-label="Editor">
				<TextArea
					label="Notes"
					name="notes"
					rows={4}
					description="Describe the change"
					errorMessage="More detail required"
					validationState="invalid"
					onCopy={onCopy}
				/>
			</form>
		</NextIntlClientProvider>,
	);
	const input = screen.getByRole<HTMLTextAreaElement>("textbox", { name: "Notes" });
	expect(input.rows).toBe(4);
	expect(input.getAttribute("aria-invalid")).toBe("true");
	const description = input
		.getAttribute("aria-describedby")
		?.split(" ")
		.map((id) => document.getElementById(id)?.textContent);
	expect(description).toEqual(
		expect.arrayContaining(["Describe the change", "More detail required"]),
	);
	await user.type(input, "First line{Enter}Second line");
	fireEvent.copy(input);
	expect(onCopy).toHaveBeenCalledTimes(1);
	expect(new FormData(screen.getByRole<HTMLFormElement>("form")).get("notes")).toBe(
		"First line\nSecond line",
	);
});
