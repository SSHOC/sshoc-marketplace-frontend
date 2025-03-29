"use server";

import { assert, createUrl, HttpError, log, request } from "@acdh-oeaw/lib";
import { getTranslations } from "next-intl/server";
import * as v from "valibot";

import { env } from "@/config/env.config";
import { redirect } from "@/lib/navigation/navigation";
import { type ActionState, createErrorActionState } from "@/lib/server/actions";
import { createSession } from "@/lib/server/auth/session";
import { isRateLimitError } from "@/lib/server/errors";
import { assertGlobalPostRateLimit } from "@/lib/server/rate-limit/global-rate-limit";

const SignInSchema = v.object({
	username: v.pipe(v.string(), v.nonEmpty()),
	password: v.pipe(v.string(), v.nonEmpty()),
});

const signInUrl = createUrl({
	baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
	pathname: "/api/auth/sign-in",
});

export async function signInAction(state: ActionState, formData: FormData): Promise<ActionState> {
	const t = await getTranslations("actions.signInAction");
	const e = await getTranslations("errors");

	try {
		await assertGlobalPostRateLimit();

		const payload = await v.parseAsync(SignInSchema, {
			username: formData.get("username"),
			password: formData.get("password"),
		});

		const response = await request(signInUrl, {
			method: "post",
			body: payload,
			responseType: "raw",
		});

		const token = response.headers.get("authorization");

		assert(token);

		await createSession(token);
	} catch (error) {
		log.error(error);

		if (isRateLimitError(error)) {
			return createErrorActionState({ message: e("too-many-requests"), formData });
		}

		if (v.isValiError<typeof SignInSchema>(error)) {
			return createErrorActionState({
				message: e("invalid-form-fields"),
				errors: v.flatten<typeof SignInSchema>(error.issues).nested,
				formData,
			});
		}

		if (error instanceof HttpError) {
			switch (error.response.status) {
				case 401: {
					return createErrorActionState({ message: t("invalid-username-password"), formData });
				}
			}
		}

		return createErrorActionState({ message: e("internal-server-error"), formData });
	}

	redirect("/");
}
