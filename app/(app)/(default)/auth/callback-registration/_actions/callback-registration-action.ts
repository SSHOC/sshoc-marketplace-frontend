"use server";

import { assert, createUrl, createUrlSearchParams, log, request } from "@acdh-oeaw/lib";
import { getTranslations } from "next-intl/server";
import * as v from "valibot";

import { env } from "@/config/env.config";
import { redirect } from "@/lib/navigation/navigation";
import { type ActionState, createErrorActionState } from "@/lib/server/actions";
import { createRegistrationSession } from "@/lib/server/auth/registration";
import { isHttpError, isRateLimitError, isValidationError } from "@/lib/server/errors";
import { assertGlobalPostRateLimit } from "@/lib/server/rate-limit/global-rate-limit";

const CallbackRegistrationSchema = v.object({
	token: v.pipe(v.string(), v.nonEmpty()),
});

export async function callbackRegistrationAction(formData: FormData): Promise<ActionState> {
	const t = await getTranslations("actions.callbackRegistrationAction");
	const e = await getTranslations("errors");

	let data;

	try {
		await assertGlobalPostRateLimit();

		const payload = await v.parseAsync(CallbackRegistrationSchema, {
			token: formData.get("token"),
		});

		const url = createUrl({
			baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
			pathname: "/api/oauth/token",
		});

		// FIXME: move to api client
		const response = await request(url, {
			method: "put",
			body: {
				...payload,
				registration: true,
			},
			responseType: "raw",
		});

		const token = response.headers.get("authorization");
		data = (await response.json()) as { displayName: string; email: string; id: number };

		assert(token);

		await createRegistrationSession(token);
	} catch (error) {
		log.error(error);

		// TODO: don't return error message but redirect back to sign-in page with server toast

		if (isRateLimitError(error)) {
			return createErrorActionState({ message: e("too-many-requests"), formData });
		}

		if (isValidationError<typeof CallbackRegistrationSchema>(error)) {
			return createErrorActionState({ message: t("invalid-token") });
		}

		if (isHttpError(error)) {
			switch (error.response.status) {
				case 401: {
					return createErrorActionState({ message: t("invalid-token") });
				}
			}
		}

		return createErrorActionState({ message: e("internal-server-error") });
	}

	const { displayName, email, id } = data;

	redirect(`/auth/sign-up?${String(createUrlSearchParams({ displayName, email, id }))}`);
}
