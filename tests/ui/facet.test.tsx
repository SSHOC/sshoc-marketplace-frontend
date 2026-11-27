import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { useState } from "react";
import { Button, DialogTrigger } from "react-aria-components";
import { expect, it } from "vitest";

import { Facet, Item } from "@/lib/core/ui/Facet/Facet";
import common from "@/messages/en/common.json";

function CategoryFacet() {
	const [selected, setSelected] = useState(["dataset"]);
	return (
		<Facet defaultOpen label="Categories" name="categories" value={selected} onChange={setSelected}>
			<Item value="dataset">Datasets</Item>
			<Item value="workflow">Workflows</Item>
		</Facet>
	);
}

it("keeps controlled facet selections across collapse and submits the selected values", async () => {
	const user = userEvent.setup();
	render(
		<NextIntlClientProvider locale="en" messages={{ common }}>
			<form aria-label="Filters">
				<CategoryFacet />
			</form>
		</NextIntlClientProvider>,
	);
	const trigger = screen.getByRole("button", { name: "Categories" });
	expect(
		screen
			.getByRole("checkbox", { name: "Datasets" })
			.closest('[role="group"]')
			?.getAttribute("aria-label"),
	).toBe("Categories");
	await user.click(screen.getByRole("checkbox", { name: "Workflows" }));
	await user.click(trigger);
	expect(trigger.getAttribute("aria-expanded")).toBe("false");
	expect(screen.queryByRole("checkbox")).toBeNull();
	await user.keyboard(" ");
	expect((screen.getByRole("checkbox", { name: "Workflows" }) as HTMLInputElement).checked).toBe(
		true,
	);
	await user.click(screen.getByRole("checkbox", { name: "Datasets" }));
	const form = screen.getByRole<HTMLFormElement>("form", { name: "Filters" });
	expect(new FormData(form).getAll("categories")).toEqual(["workflow"]);
});
import { SearchFacetsOverlay } from "@/components/common/SearchFacetsOverlay";
import { ModalDialog } from "@/components/search/ModalDialog";
import { CheckBoxGroup } from "@/lib/core/ui/CheckBoxGroup/CheckBoxGroup";

it("closes the expanded facet before its search dialog and restores focus", async () => {
	const user = userEvent.setup();
	render(
		<NextIntlClientProvider locale="en" messages={{ common }}>
			<DialogTrigger>
				<Button>Refine search</Button>
				<ModalDialog title="Filters">
					<SearchFacetsOverlay
						title="Categories"
						hasMoreItems
						renderFacet={(controls) => (
							<Facet defaultOpen label="Categories" controls={controls}>
								<Item value="dataset">Datasets</Item>
							</Facet>
						)}
					>
						{() => (
							<CheckBoxGroup aria-label="All categories">
								<Item value="workflow">Workflows</Item>
							</CheckBoxGroup>
						)}
					</SearchFacetsOverlay>
				</ModalDialog>
			</DialogTrigger>
		</NextIntlClientProvider>,
	);

	const dialogTrigger = screen.getByRole("button", { name: "Refine search" });
	await user.click(dialogTrigger);
	const dialog = await screen.findByRole("dialog", { name: "Filters" });
	const more = () => within(dialog).getByRole("button", { name: common.search["show-more"] });
	const less = () => within(dialog).getByRole("button", { name: common.search["show-less"] });

	expect(more().getAttribute("aria-expanded")).toBe("false");
	await user.click(more());
	expect(document.activeElement).toBe(less());
	expect(within(dialog).getByRole("checkbox", { name: "Workflows" })).toBeTruthy();
	await user.tab();
	await user.keyboard("{Escape}");
	expect(screen.getByRole("dialog", { name: "Filters" })).toBe(dialog);
	expect(document.activeElement).toBe(more());
	expect(within(dialog).queryByRole("checkbox", { name: "Workflows" })).toBeNull();

	await user.keyboard("{Enter}");
	await user.click(less());
	expect(document.activeElement).toBe(more());
	await user.keyboard("{Escape}");
	await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
	await waitFor(() => expect(document.activeElement).toBe(dialogTrigger));
});
