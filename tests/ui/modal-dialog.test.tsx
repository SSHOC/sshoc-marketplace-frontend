import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { useState } from "react";
import { DialogTrigger } from "react-aria-components";
import { expect, it } from "vitest";

import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";
import { ModalDialog } from "@/lib/core/ui/ModalDialog/ModalDialog";
import common from "@/messages/en/common.json";

function Editor() {
	const [open, setOpen] = useState(false);
	return (
		<DialogTrigger isOpen={open} onOpenChange={setOpen}>
			<ButtonLink>Edit</ButtonLink>
			<ModalDialog isDismissable={false} title="Edit item" onClose={() => setOpen(false)}>
				<ButtonLink onPress={() => setOpen(false)}>Cancel</ButtonLink>
			</ModalDialog>
		</DialogTrigger>
	);
}

it("keeps an editor open on outside clicks and restores focus after cancellation", async () => {
	const user = userEvent.setup();
	render(
		<NextIntlClientProvider locale="en" messages={{ common }}>
			<Editor />
		</NextIntlClientProvider>,
	);
	const trigger = screen.getByRole("button", { name: "Edit" });
	await user.click(trigger);
	const dialog = await screen.findByRole("dialog", { name: "Edit item" });
	const overlay = dialog.parentElement!.parentElement!;
	await user.click(overlay);
	expect(screen.getByRole("dialog", { name: "Edit item" })).toBe(dialog);
	await user.click(screen.getByRole("button", { name: "Cancel" }));
	await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
	await waitFor(() => expect(document.activeElement).toBe(trigger));
});
