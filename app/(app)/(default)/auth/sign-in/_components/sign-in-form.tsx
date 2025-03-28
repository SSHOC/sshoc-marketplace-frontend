"use client";

import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextInput } from "@/components/ui/text-input";
import { env } from "@/config/env.config";
import { createInitialActionState } from "@/lib/server/actions";
import { createUrl, createUrlSearchParams, request } from "@acdh-oeaw/lib";
import { useActionState, type ReactNode } from "react";

export function SignInForm(): ReactNode {
	// const [state, action] = useActionState(signInAction, createInitialActionState({}));

	const signInUrl = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/api/auth/sign-in",
	});

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
				className="flex flex-col gap-y-8"
				// action={async (formData) => {
				// 	const response = await request(signInUrl, { method: "post", body: formData });
				// }}
				onSubmit={async (event) => {
					event.preventDefault();

					const formData = new FormData(event.currentTarget);
					const response = await request(signInUrl, { method: "post", body: formData });
				}}
			>
				<TextInput name="username" isRequired>
					<Label>Username</Label>
					<Input />
					<FieldError />
				</TextInput>

				<TextInput name="password" isRequired type="password">
					<Label>Password</Label>
					<Input />
					<FieldError />
				</TextInput>

				<SubmitButton>Submit</SubmitButton>
			</form>

			<hr />

			<a href={String(oauthUrl)}>Sign in with EOSC</a>
		</div>
	);
}
