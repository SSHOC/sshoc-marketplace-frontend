"use server";

import { assert, createUrl, log, request } from "@acdh-oeaw/lib";
import { getTranslations } from "next-intl/server";
import * as v from "valibot";

import { env } from "@/config/env.config";
import { redirect } from "@/lib/navigation/navigation";
import { type ActionState, createErrorActionState } from "@/lib/server/actions";
import { invalidateRegistrationSession } from "@/lib/server/auth/registration";
import { createSession } from "@/lib/server/auth/session";
import { isHttpError, isRateLimitError, isValidationError } from "@/lib/server/errors";
import { assertGlobalPostRateLimit } from "@/lib/server/rate-limit/global-rate-limit";

const SignUpSchema = v.object({
	acceptedRegulations: v.pipe(
		v.string(),
		v.transform((input) => {
			return input === "on" ? true : false;
		}),
	),
	displayName: v.pipe(v.string(), v.nonEmpty()),
	email: v.pipe(v.string(), v.email()),
	id: v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1)),
});

export async function signUpAction(state: ActionState, formData: FormData): Promise<ActionState> {
	const t = await getTranslations("actions.signUpAction");
	const e = await getTranslations("errors");

	try {
		await assertGlobalPostRateLimit();

		const payload = await v.parseAsync(SignUpSchema, {
			acceptedRegulations: formData.get("acceptedRegulations"),
			displayName: formData.get("displayName"),
			email: formData.get("email"),
			id: formData.get("id"),
		});

		const url = createUrl({
			baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
			pathname: "/api/oauth/sign-up",
		});

		// FIXME: move to api client
		const response = await request(url, {
			method: "put",
			body: payload,
			responseType: "raw",
		});

		const token = response.headers.get("authorization");

		assert(token);

		await createSession(token);
		await invalidateRegistrationSession();
	} catch (error) {
		log.error(error);

		if (isRateLimitError(error)) {
			return createErrorActionState({ message: e("too-many-requests"), formData });
		}

		if (isValidationError<typeof SignUpSchema>(error)) {
			return createErrorActionState({
				message: e("invalid-form-fields"),
				errors: v.flatten<typeof SignUpSchema>(error.issues).nested,
				formData,
			});
		}

		if (isHttpError(error)) {
			switch (error.response.status) {
				case 401: {
					return createErrorActionState({ message: t("invalid-token"), formData });
				}
			}
		}

		return createErrorActionState({ message: e("internal-server-error"), formData });
	}

	redirect("/");
}
