import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { expect, it } from "vitest";

import { WorkflowStepsList } from "@/components/item/WorkflowStepsList";
import type { WorkflowStep } from "@/data/sshoc/api/workflow-step";
import common from "@/messages/en/common.json";

function createStep(id: number, label: string, description: string): WorkflowStep {
	return {
		persistentId: `step-${id}`,
		id,
		category: "step",
		label,
		description,
		lastInfoUpdate: "2026-01-01T00:00:00Z",
		status: "approved",
		informationContributor: {
			id: 1,
			username: "contributor",
			displayName: "Contributor",
			status: "enabled",
			registrationDate: "2026-01-01T00:00:00Z",
			role: "contributor",
			email: "contributor@example.org",
			config: false,
		},
		contributors: [],
		properties: [],
		externalIds: [],
		accessibleAt: [],
		relatedItems: [],
		media: [],
		composedOf: [],
	};
}

it("expands workflow steps independently and keeps keyboard focus on the trigger", async () => {
	const user = userEvent.setup();
	render(
		<NextIntlClientProvider locale="en" messages={{ common }}>
			<WorkflowStepsList
				steps={[
					createStep(1, "Collect", "Collect the records."),
					createStep(2, "Review", "Review the records."),
				]}
			/>
		</NextIntlClientProvider>,
	);

	const [first, second] = screen.getAllByRole("article").map((article) => within(article));
	const firstTrigger = first!.getByRole("button", { name: "Expand" });
	const secondTrigger = second!.getByRole("button", { name: "Expand" });
	expect(firstTrigger.getAttribute("aria-expanded")).toBe("false");
	expect(screen.queryByText("Collect the records.")).toBeNull();
	await user.tab();
	await user.keyboard("{Enter}");
	expect(firstTrigger.getAttribute("aria-expanded")).toBe("true");
	expect(screen.getByText("Collect the records.")).toBeTruthy();

	await user.click(secondTrigger);
	expect(secondTrigger.getAttribute("aria-expanded")).toBe("true");
	expect(firstTrigger.getAttribute("aria-expanded")).toBe("true");
	expect(screen.getByText("Review the records.")).toBeTruthy();

	await user.keyboard(" ");
	expect(secondTrigger.getAttribute("aria-expanded")).toBe("false");
	expect(document.activeElement).toBe(secondTrigger);
	expect(screen.queryByText("Review the records.")).toBeNull();
	expect(firstTrigger.getAttribute("aria-expanded")).toBe("true");
});
