"use client";

import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import { type ReactNode, useActionState, useTransition } from "react";

import { signInAction } from "@/app/(app)/(default)/auth/sign-in/_actions/sign-in-action";
import { FieldError } from "@/components/ui/field-error";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextInput } from "@/components/ui/text-input";
import { env } from "@/config/env.config";
import { createInitialActionState } from "@/lib/server/actions";

export function SignInForm(): ReactNode {
	const t = useTranslations("SignInForm");
	const [state, action] = useActionState(signInAction, createInitialActionState({}));
	const [isPending, startTransition] = useTransition();

	const oauthUrl = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/oauth2/authorize/eosc",
		searchParams: createUrlSearchParams({
			"success-redirect-url": String(
				createUrl({
					baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
					pathname: "/auth/sign-in",
				}),
			),
			"registration-redirect-url": String(
				createUrl({
					baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
					pathname: "/auth/sign-up",
				}),
			),
			"failure-redirect-url": String(
				createUrl({
					baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
					pathname: "/auth/error",
				}),
			),
		}),
	});

	return (
		<div className="p-8">
			<form
				action={action}
				className="flex flex-col gap-y-8"
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

				<TextInput isRequired={true} name="username">
					<Label>{t("username")}</Label>
					<Input />
					<FieldError />
				</TextInput>

				<TextInput isRequired={true} name="password" type="password">
					<Label>{t("password")}</Label>
					<Input />
					<FieldError />
				</TextInput>

				<SubmitButton>{t("submit")}</SubmitButton>
			</form>

			<hr />

			<a href={String(oauthUrl)}>{t("sign-in-eosc")}</a>
		</div>
	);
}
