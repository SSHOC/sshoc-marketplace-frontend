"use client";

import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import { type ReactNode, useActionState, useTransition } from "react";

import { signInAction } from "@/app/(app)/(default)/auth/sign-in/_actions/sign-in-action";
import { Image } from "@/components/image";
import { FieldError } from "@/components/ui/field-error";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextInput } from "@/components/ui/text-input";
import { env } from "@/config/env.config";
import { createInitialActionState } from "@/lib/server/actions";
import logo from "@/public/assets/images/logo-my-access-id.png";

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
					pathname: "/auth/callback-success",
				}),
			),
			"registration-redirect-url": String(
				createUrl({
					baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
					pathname: "/auth/callback-registration",
				}),
			),
			"failure-redirect-url": String(
				createUrl({
					baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
					pathname: "/auth/callback-error",
				}),
			),
		}),
	});

	return (
		<div className="flex max-w-xl flex-col gap-y-8 p-8">
			<p>{t.rich("messages.oauth", { em: AccountName })}</p>

			<a
				className="relative flex items-center justify-center rounded-sm bg-neutral-75 p-4 text-center text-base font-medium text-brand-700 shadow transition hover:bg-neutral-100"
				href={String(oauthUrl)}
			>
				<Image alt="" className="absolute left-4 size-10 shrink-0 rounded-full" src={logo} />
				{t("sign-in-my-access-id")}
			</a>

			<div className="my-8 flex items-baseline gap-x-4">
				<p className="font-medium">{t("messages.alternate")}</p>
				<Separator className="flex-1" />
			</div>

			<p>{t("messages.auth")}</p>

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

				<SubmitButton className="self-end">{t("submit")}</SubmitButton>
			</form>
		</div>
	);
}

function AccountName(chunks: ReactNode): ReactNode {
	return <em className="font-medium not-italic">{chunks}</em>;
}
