import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, DialogTrigger } from "react-aria-components";
import { expect, it } from "vitest";

import { ModalDialog } from "@/components/search/ModalDialog";

function SearchDialog() {
	return (
		<DialogTrigger>
			<Button>Open search</Button>
			<ModalDialog isDismissable title="Search items">
				<input aria-label="Query" />
			</ModalDialog>
		</DialogTrigger>
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
