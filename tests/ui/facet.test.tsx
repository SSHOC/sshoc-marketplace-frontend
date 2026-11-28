import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { useState } from "react";
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
