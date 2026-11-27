import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { expect, it, vi } from "vitest";

import { Button } from "@/lib/core/ui/Button/Button";
import { ButtonLink } from "@/lib/core/ui/Button/ButtonLink";

it("submits an associated form through either shared button and forwards the button ref", async () => {
	const user = userEvent.setup();
	const onSubmit = vi.fn((event: { preventDefault(): void }) => event.preventDefault());
	const ref = createRef<HTMLButtonElement>();

	render(
		<>
			<form id="editor" onSubmit={onSubmit} />
			<Button form="editor" type="submit" ref={ref}>
				Save
			</Button>
			<ButtonLink form="editor" type="submit">
				Save and close
			</ButtonLink>
		</>,
	);

	const save = screen.getByRole("button", { name: "Save" });
	expect(ref.current).toBe(save);
	await user.click(save);
	expect(onSubmit).toHaveBeenCalledTimes(1);

	await user.tab();
	expect(document.activeElement).toBe(screen.getByRole("button", { name: "Save and close" }));
	await user.keyboard("{Enter}");
	expect(onSubmit).toHaveBeenCalledTimes(2);
});
