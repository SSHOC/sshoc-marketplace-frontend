import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, it } from "vitest";

import { ModalDialog } from "@/components/search/ModalDialog";

function SearchDialog() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<button type="button" onClick={() => setOpen(true)}>
				Open search
			</button>
			{open ? (
				<ModalDialog isOpen isDismissable title="Search items" onClose={() => setOpen(false)}>
					<input aria-label="Query" />
				</ModalDialog>
			) : null}
		</>
	);
}

it("labels the search dialog and restores trigger focus after Escape", async () => {
	const user = userEvent.setup();
	render(<SearchDialog />);
	const trigger = screen.getByRole("button", { name: "Open search" });
	await user.click(trigger);
	expect(await screen.findByRole("dialog", { name: "Search items" })).toBeTruthy();
	await user.tab();
	expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Query" }));
	await user.keyboard("{Escape}");
	await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
	await waitFor(() => expect(document.activeElement).toBe(trigger));
});
