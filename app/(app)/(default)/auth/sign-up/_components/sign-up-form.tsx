"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useActionState, useTransition } from "react";

import { signUpAction } from "@/app/(app)/(default)/auth/sign-up/_actions/sign-up-action";
import { CheckBox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field-error";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextInput } from "@/components/ui/text-input";
import { createInitialActionState } from "@/lib/server/actions";

interface SignUpFormProps {
	displayName: string;
	email: string;
	id: number;
}

export function SignUpForm(props: SignUpFormProps): ReactNode {
	const { displayName, email, id } = props;

	const t = useTranslations("SignUpForm");
	const [state, action] = useActionState(signUpAction, createInitialActionState({}));
	const [isPending, startTransition] = useTransition();

	return (
		<div className="flex max-w-xl flex-col gap-y-8 p-8">
			<form
				action={action}
				className="flex flex-col gap-y-6"
				data-pending={isPending || undefined}
				onSubmit={(event) => {
					event.preventDefault();

					const formData = new FormData(event.currentTarget);

					startTransition(() => {
						action(formData);
					});
				}}
			>
				<FormError state={state} />

				<input name="id" type="hidden" value={id} />

				<TextInput isReadOnly={true} isRequired={true} name="displayName" value={displayName}>
					<Label>{t("name")}</Label>
					<Input />
					<FieldError />
				</TextInput>

				<TextInput isReadOnly={true} isRequired={true} name="email" type="email" value={email}>
					<Label>{t("email")}</Label>
					<Input />
					<FieldError />
				</TextInput>

				<CheckBox name="acceptedRegulations">Accept terms of service</CheckBox>

				<SubmitButton className="self-end">{t("submit")}</SubmitButton>
			</form>
		</div>
	);
}
