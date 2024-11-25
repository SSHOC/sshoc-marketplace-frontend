import { createUrl, getFormDataValues } from "@acdh-oeaw/lib";
import type { ReactNode } from "react";
import * as v from "valibot";

import { env } from "@/config/env.config";
import { redirect } from "@/lib/i18n/navigation";

const SignInSchema = v.object({
	username: v.pipe(v.string(), v.nonEmpty()),
	password: v.pipe(v.string(), v.nonEmpty()),
});

export function SignInForm(): ReactNode {
	async function action(formData: FormData) {
		"use server";

		const result = await v.safeParseAsync(SignInSchema, getFormDataValues(formData));

		if (!result.success) {
			return { message: "Error" };
		}

		const { username, password } = result.output;

		const url = createUrl({
			baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
			pathname: "/api/auth/sign-in",
		});

		try {
			const response = await fetch(url, {
				method: "post",
				body: JSON.stringify({ username, password }),
			});

			// api issues token which are valid for 24 hours
			const token = response.headers.get("authorization");

			if (token == null) {
				return { message: "Error" };
			}

			console.log("TOKEN", token);

			redirect("/");
		} catch (error) {
			console.error(error);
			return { message: "Error" };
		}
	}

	return (
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		<form action={action}>
			<label>
				<div>Username</div>
				<input name="username" required={true} />
			</label>

			<label>
				<div>Password</div>
				<input name="password" required={true} />
			</label>

			<button type="submit">Submit</button>
		</form>
	);
}
