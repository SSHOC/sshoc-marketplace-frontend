import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { createRef } from "react";
import { expect, it } from "vitest";

import { ProgressSpinner } from "@/lib/core/ui/ProgressSpinner/ProgressSpinner";
import common from "@/messages/en/common.json";

it("exposes an indeterminate progress bar with default and custom accessible names", () => {
	const spinnerRef = createRef<HTMLDivElement>();
	render(
		<NextIntlClientProvider locale="en" messages={{ common }}>
			<ProgressSpinner />
			<ProgressSpinner aria-label="Loading results" />
			<span id="upload-label">Uploading file</span>
			<ProgressSpinner ref={spinnerRef} aria-labelledby="upload-label" />
		</NextIntlClientProvider>,
	);

	const spinner = screen.getByRole("progressbar", { name: common["default-spinner-message"] });
	expect(spinner.hasAttribute("aria-valuenow")).toBe(false);
	expect(screen.getByRole("progressbar", { name: "Loading results" })).toBeTruthy();
	expect(screen.getByRole("progressbar", { name: "Uploading file" })).toBe(spinnerRef.current);
	expect(spinnerRef.current?.hasAttribute("aria-label")).toBe(false);
});
