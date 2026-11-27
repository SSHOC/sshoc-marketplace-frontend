import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { expect, it, vi } from "vitest";

import { Form } from "@/lib/core/form/Form";
import { FormFileInput } from "@/lib/core/form/FormFileInput";
import common from "@/messages/en/common.json";

it("focuses the file picker on validation failure and submits the selected files", async () => {
	const user = userEvent.setup();
	const submit = vi.fn();
	const { container } = render(
		<NextIntlClientProvider locale="en" messages={{ common }}>
			<Form<{ file?: FileList }>
				onSubmit={submit}
				validate={(values) => (values.file?.length ? {} : { file: "Choose a file" })}
			>
				<FormFileInput label="Choose image" name="file" fileTypes={["image"]} />
				<button type="submit">Save</button>
			</Form>
		</NextIntlClientProvider>,
	);
	const picker = screen.getByRole("button", { name: "Choose image" });
	const save = screen.getByRole("button", { name: "Save" });
	await user.click(save);
	expect(document.activeElement).toBe(picker);
	expect(picker.getAttribute("aria-describedby")).toBe(screen.getByText("Choose a file").id);
	const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
	expect(input.accept).toBe("image/*");
	const file = new File(["image"], "example.png", { type: "image/png" });
	await user.upload(input, file);
	expect(screen.getByText(/example.png/)).toBeTruthy();
	await user.click(save);
	expect(submit.mock.calls[0]?.[0].file.item(0)).toBe(file);
});
