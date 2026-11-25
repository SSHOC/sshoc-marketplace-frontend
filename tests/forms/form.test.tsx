import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FORM_ERROR } from "final-form";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { useState } from "react";
import { useForm, useFormState } from "react-final-form";
import { FieldArray, useFieldArray } from "react-final-form-arrays";
import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { z } from "zod";

import { useReviewFieldMetadata } from "@/components/item-form/useReviewFieldMetadata";
import { Form } from "@/lib/core/form/Form";
import { FormButton } from "@/lib/core/form/FormButton";
import { FormTextField } from "@/lib/core/form/FormTextField";
import { useFieldState } from "@/lib/core/form/useFieldState";
import { validateSchema } from "@/lib/core/form/validateSchema";

function renderForm(ui: ReactNode) {
	return render(
		<NextIntlClientProvider locale="en" messages={{}}>
			{ui}
		</NextIntlClientProvider>,
	);
}

function Status() {
	const { dirty, submitting, submitSucceeded, submitError } = useFormState();
	return (
		<output aria-label="Form state">
			{JSON.stringify({ dirty, submitting, submitSucceeded, submitError })}
		</output>
	);
}

function state() {
	return JSON.parse(screen.getByLabelText("Form state").textContent!);
}

function ArrayFields() {
	return (
		<FieldArray name="links">
			{({ fields }) => (
				<>
					{fields.map((name, index) => (
						<div key={name}>
							<FormTextField name={`${name}.url`} label={`Link ${index + 1}`} />
							<button type="button" onClick={() => fields.remove(index)}>
								Remove link {index + 1}
							</button>
						</div>
					))}
					<button type="button" onClick={() => fields.push({ url: "" })}>
						Add link
					</button>
					<button type="button" onClick={() => fields.move(0, 1)}>
						Move first link down
					</button>
				</>
			)}
		</FieldArray>
	);
}

function ReviewField() {
	const form = useForm();
	const { metadata, onApprove, onReject } = useReviewFieldMetadata<string>({ name: "label" });
	const field = useFieldState<string>("label", { touched: true });
	return (
		<>
			<output aria-label="Review metadata">{JSON.stringify(metadata ?? null)}</output>
			<output aria-label="Touched">{String(field.meta.touched)}</output>
			<button
				type="button"
				onClick={() =>
					form.mutators["setFieldData"]!("label", {
						diff: { current: "Original", suggested: "Suggestion" },
					})
				}
			>
				Mark for review
			</button>
			<button type="button" onClick={onApprove}>
				Approve
			</button>
			<button type="button" onClick={onReject}>
				Reject
			</button>
			<button type="button" onClick={() => form.mutators["setFieldTouched"]!("label", true)}>
				Touch field
			</button>
		</>
	);
}

describe("shared form upgrade baseline", () => {
	it("updates a typed array entry without losing its neighboring entries", async () => {
		const user = userEvent.setup();
		const submit = vi.fn();
		function ReplaceEntry() {
			const { fields } = useFieldArray<{ url: string }>("links");
			expectTypeOf(fields.value).toEqualTypeOf<Array<{ url: string }>>();
			return (
				<button type="button" onClick={() => fields.update(0, { url: "https://replacement.test" })}>
					Replace link
				</button>
			);
		}
		renderForm(
			<Form
				initialValues={{ links: [{ url: "https://first.test" }, { url: "https://last.test" }] }}
				onSubmit={submit}
			>
				<ArrayFields />
				<ReplaceEntry />
				<FormButton type="submit">Save</FormButton>
			</Form>,
		);
		await user.click(screen.getByRole("button", { name: "Replace link" }));
		expect((screen.getByRole("textbox", { name: "Link 1" }) as HTMLInputElement).value).toBe(
			"https://replacement.test",
		);
		await user.click(screen.getByRole("button", { name: "Save" }));
		expect(submit.mock.calls[0]![0]).toEqual({
			links: [{ url: "https://replacement.test" }, { url: "https://last.test" }],
		});
	});

	it("does not steal focus while another field still has a validation error", async () => {
		const user = userEvent.setup();
		const validate = validateSchema(z.object({ label: z.string().min(1), url: z.string().url() }));
		renderForm(
			<Form initialValues={{ label: "", url: "invalid" }} validate={validate} onSubmit={vi.fn()}>
				<FormTextField name="label" label="Title" />
				<FormTextField name="url" label="URL" />
				<FormButton type="submit">Save</FormButton>
			</Form>,
		);
		const url = screen.getByRole("textbox", { name: "URL" });
		await user.clear(url);
		await user.type(url, "https://example.test");
		await waitFor(() => expect(url.getAttribute("aria-invalid")).not.toBe("true"));
		expect(document.activeElement).toBe(url);
	});

	it("restores a conditional field after unmounting and preserves explicit null values", async () => {
		const user = userEvent.setup();
		const submit = vi.fn();
		function ConditionalFields() {
			const [visible, setVisible] = useState(true);
			const form = useForm();
			const nullable = useFieldState<string | null>("nullable");
			return (
				<>
					<button type="button" onClick={() => setVisible(!visible)}>
						Toggle field
					</button>
					{visible ? <FormTextField name="conditional" label="Conditional title" /> : null}
					<output aria-label="Nullable value">{JSON.stringify(nullable.input.value)}</output>
					<button type="button" onClick={() => form.change("nullable", null)}>
						Clear nullable value
					</button>
				</>
			);
		}
		renderForm(
			<Form initialValues={{ conditional: "Original", nullable: "Value" }} onSubmit={submit}>
				<ConditionalFields />
				<FormButton type="submit">Save</FormButton>
			</Form>,
		);
		await user.type(screen.getByRole("textbox", { name: "Conditional title" }), " edited");
		await user.click(screen.getByRole("button", { name: "Toggle field" }));
		expect(screen.queryByRole("textbox", { name: "Conditional title" })).toBeNull();
		await user.click(screen.getByRole("button", { name: "Toggle field" }));
		expect(
			(screen.getByRole("textbox", { name: "Conditional title" }) as HTMLInputElement).value,
		).toBe("Original edited");
		await user.click(screen.getByRole("button", { name: "Clear nullable value" }));
		expect(screen.getByLabelText("Nullable value").textContent).toBe("null");
		await user.click(screen.getByRole("button", { name: "Save" }));
		expect(submit.mock.calls[0]![0]).toEqual({ conditional: "Original edited", nullable: null });
	});

	it("adds, edits, reorders and removes nested array values before submission", async () => {
		const user = userEvent.setup();
		const submit = vi.fn();
		renderForm(
			<Form
				initialValues={{ links: [{ url: "https://first.test" }, { url: "https://second.test" }] }}
				onSubmit={submit}
			>
				<ArrayFields />
				<FormButton type="submit">Save</FormButton>
			</Form>,
		);
		await user.click(screen.getByRole("button", { name: "Add link" }));
		await user.type(screen.getByRole("textbox", { name: "Link 3" }), "https://third.test");
		await user.click(screen.getByRole("button", { name: "Move first link down" }));
		expect((screen.getByRole("textbox", { name: "Link 1" }) as HTMLInputElement).value).toBe(
			"https://second.test",
		);
		await user.clear(screen.getByRole("textbox", { name: "Link 2" }));
		await user.type(screen.getByRole("textbox", { name: "Link 2" }), "https://edited.test");
		await user.click(screen.getByRole("button", { name: "Remove link 1" }));
		await user.click(screen.getByRole("button", { name: "Save" }));
		expect(submit).toHaveBeenCalledTimes(1);
		expect(submit.mock.calls[0]![0]).toEqual({
			links: [{ url: "https://edited.test" }, { url: "https://third.test" }],
		});
	});

	it("blocks invalid submission, focuses the first error and clears translated errors after correction", async () => {
		const user = userEvent.setup();
		const submit = vi.fn();
		const validate = validateSchema(
			z.object({ label: z.string().min(1), links: z.array(z.object({ url: z.string().url() })) }),
			() => "Please correct this field",
		);
		renderForm(
			<Form
				initialValues={{ label: "", links: [{ url: "bad" }] }}
				validate={validate}
				onSubmit={submit}
			>
				<FormTextField name="label" label="Title" />
				<FormTextField name="links[0].url" label="URL" />
				<FormButton type="submit">Save</FormButton>
			</Form>,
		);
		await user.click(screen.getByRole("button", { name: "Save" }));
		await waitFor(() => expect(screen.getAllByText("Please correct this field")).toHaveLength(2));
		expect(submit).not.toHaveBeenCalled();
		expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Title" }));
		await user.type(screen.getByRole("textbox", { name: "Title" }), "A dataset");
		await user.clear(screen.getByRole("textbox", { name: "URL" }));
		await user.type(screen.getByRole("textbox", { name: "URL" }), "https://example.test");
		await user.click(screen.getByRole("button", { name: "Save" }));
		await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
		expect(screen.queryByText("Please correct this field")).toBeNull();
	});

	it("retains edits after a failed submission and disables controls only while pending", async () => {
		const user = userEvent.setup();
		let finish!: (errors: Record<string, string>) => void;
		const submit = vi.fn(
			() =>
				new Promise<Record<string, string>>((resolve) => {
					finish = resolve;
				}),
		);
		renderForm(
			<Form initialValues={{ label: "Original" }} onSubmit={submit}>
				<FormTextField name="label" label="Title" />
				<FormButton type="submit">Save</FormButton>
				<Status />
			</Form>,
		);
		await user.type(screen.getByRole("textbox", { name: "Title" }), " edited");
		await user.click(screen.getByRole("button", { name: "Save" }));
		expect(state().submitting).toBe(true);
		expect((screen.getByRole("button", { name: "Save" }) as HTMLButtonElement).disabled).toBe(true);
		expect((screen.getByRole("textbox", { name: "Title" }) as HTMLInputElement).disabled).toBe(
			true,
		);
		await act(async () => finish({ [FORM_ERROR]: "Server rejected the item" }));
		expect(state()).toMatchObject({
			dirty: true,
			submitting: false,
			submitSucceeded: false,
			submitError: "Server rejected the item",
		});
		expect((screen.getByRole("textbox", { name: "Title" }) as HTMLInputElement).value).toBe(
			"Original edited",
		);
		expect((screen.getByRole("button", { name: "Save" }) as HTMLButtonElement).disabled).toBe(
			false,
		);
	});

	it("becomes pristine when a successful save reinitializes with persisted values", async () => {
		const user = userEvent.setup();
		const submit = vi.fn();
		function SavedForm() {
			const [initialValues, setInitialValues] = useState({ label: "Original" });
			return (
				<Form
					initialValues={initialValues}
					onSubmit={async (values) => {
						submit(values);
						setInitialValues(values);
					}}
				>
					<FormTextField name="label" label="Title" />
					<FormButton type="submit">Save</FormButton>
					<Status />
				</Form>
			);
		}
		renderForm(<SavedForm />);
		await user.type(screen.getByRole("textbox", { name: "Title" }), " edited");
		expect(state().dirty).toBe(true);
		await user.click(screen.getByRole("button", { name: "Save" }));
		await waitFor(() =>
			expect(state()).toMatchObject({ dirty: false, submitting: false, submitSucceeded: true }),
		);
		expect(submit).toHaveBeenCalledWith({ label: "Original edited" });
		expect((screen.getByRole("textbox", { name: "Title" }) as HTMLInputElement).value).toBe(
			"Original edited",
		);
	});

	it("keeps dirty edits while refreshing untouched fields on reinitialization", async () => {
		const user = userEvent.setup();
		function RefreshForm() {
			const [initialValues, setInitialValues] = useState({ label: "Original", version: "1" });
			return (
				<>
					<button
						type="button"
						onClick={() => setInitialValues({ label: "Server title", version: "2" })}
					>
						Refresh
					</button>
					<Form initialValues={initialValues} onSubmit={vi.fn()}>
						<FormTextField name="label" label="Title" />
						<FormTextField name="version" label="Version" />
						<Status />
					</Form>
				</>
			);
		}
		renderForm(<RefreshForm />);
		await user.type(screen.getByRole("textbox", { name: "Title" }), " edited");
		await user.click(screen.getByRole("button", { name: "Refresh" }));
		expect((screen.getByRole("textbox", { name: "Title" }) as HTMLInputElement).value).toBe(
			"Original edited",
		);
		expect((screen.getByRole("textbox", { name: "Version" }) as HTMLInputElement).value).toBe("2");
		expect(state().dirty).toBe(true);
	});

	it("preserves review metadata mutators and supports rejecting or approving a suggestion", async () => {
		const user = userEvent.setup();
		renderForm(
			<Form initialValues={{ label: "Suggestion" }} onSubmit={vi.fn()}>
				<FormTextField name="label" label="Title" />
				<ReviewField />
			</Form>,
		);
		await user.click(screen.getByRole("button", { name: "Mark for review" }));
		expect(screen.getByLabelText("Review metadata").textContent).toContain("Original");
		await user.click(screen.getByRole("button", { name: "Reject" }));
		expect((screen.getByRole("textbox", { name: "Title" }) as HTMLInputElement).value).toBe(
			"Original",
		);
		expect(screen.getByLabelText("Review metadata").textContent).toBe("null");
		await user.clear(screen.getByRole("textbox", { name: "Title" }));
		await user.type(screen.getByRole("textbox", { name: "Title" }), "Suggestion");
		await user.click(screen.getByRole("button", { name: "Mark for review" }));
		await user.click(screen.getByRole("button", { name: "Approve" }));
		expect((screen.getByRole("textbox", { name: "Title" }) as HTMLInputElement).value).toBe(
			"Suggestion",
		);
		expect(screen.getByLabelText("Review metadata").textContent).toBe("null");
		await user.click(screen.getByRole("button", { name: "Touch field" }));
		expect(screen.getByLabelText("Touched").textContent).toBe("true");
	});
});
