"use client";

import { type ReactNode, useActionState, useTransition } from "react";

import { sendContactFormEmailAction } from "@/app/(app)/(default)/contact/_actions/send-contact-form-email-action";
import { Form } from "@/components/form";
import { HoneypotField } from "@/components/honeypot-field";
import { FieldError } from "@/components/ui/field-error";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextInput } from "@/components/ui/text-input";
import { TextArea } from "@/components/ui/textarea";
import { createInitialActionState, getFieldErrors } from "@/lib/server/actions";

interface ContactFormProps {
	emailLabel: string;
	messageLabel: string;
	subjectLabel: string;
	submitLabel: string;
}

export function ContactForm(props: ContactFormProps): ReactNode {
	const { emailLabel, messageLabel, subjectLabel, submitLabel } = props;

	const [state, action] = useActionState(sendContactFormEmailAction, createInitialActionState({}));
	const [isPending, startTransition] = useTransition();

	return (
		<Form
			action={action}
			className="flex flex-col gap-y-8"
			data-pending={isPending || undefined}
			onSubmit={(event) => {
				event.preventDefault();

				startTransition(() => {
					action(new FormData(event.currentTarget));
				});
			}}
			validationErrors={getFieldErrors(state)}
		>
			<FormError state={state} />
			<FormSuccess state={state} />

			<HoneypotField />

			<TextInput autoComplete="email" isRequired={true} name="email" type="email">
				<Label>{emailLabel}</Label>
				<FieldError />
				<Input />
			</TextInput>

			<TextInput isRequired={true} name="subject">
				<Label>{subjectLabel}</Label>
				<FieldError />
				<Input />
			</TextInput>

			<TextInput isRequired={true} name="message">
				<Label>{messageLabel}</Label>
				<FieldError />
				<TextArea rows={5} />
			</TextInput>

			<div>
				<SubmitButton>{submitLabel}</SubmitButton>
			</div>
		</Form>
	);
}
