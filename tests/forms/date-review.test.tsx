import { render, screen } from "@testing-library/react";
import type { FormApi } from "final-form";
import { NextIntlClientProvider } from "next-intl";
import { useForm } from "react-final-form";
import { expect, it, vi } from "vitest";

import { DateReviewFormSection } from "@/components/item-form/DateReviewFormSection";
import { useDatasetFormFields } from "@/components/item-form/useDatasetFormFields";
import { Form } from "@/lib/core/form/Form";
import authenticated from "@/messages/en/authenticated.json";
import common from "@/messages/en/common.json";

it("registers date reviews against their date fields rather than the item label", () => {
	const initialValues = {
		label: "Dataset",
		dateCreated: "2025-01-02T00:00:00Z",
		dateLastUpdated: "2025-03-04T00:00:00Z",
	};
	let form: FormApi<typeof initialValues> | undefined;
	function DateFields() {
		form = useForm<typeof initialValues>();
		const fields = useDatasetFormFields();
		return <DateReviewFormSection formFields={fields} />;
	}
	render(
		<NextIntlClientProvider locale="en" messages={{ authenticated, common }}>
			<Form initialValues={initialValues} onSubmit={vi.fn()}>
				<DateFields />
			</Form>
		</NextIntlClientProvider>,
	);
	expect(form?.getRegisteredFields().sort()).toEqual(["dateCreated", "dateLastUpdated"]);
	expect((screen.getByLabelText("Date created") as HTMLInputElement).value).toBe("2025-01-02");
	expect((screen.getByLabelText("Date last updated") as HTMLInputElement).value).toBe("2025-03-04");
});
