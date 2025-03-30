"use server";

import { assert, createUrl, log, request } from "@acdh-oeaw/lib";
import { getTranslations } from "next-intl/server";
import * as v from "valibot";

import { env } from "@/config/env.config";
import { redirect } from "@/lib/navigation/navigation";
import { type ActionState, createErrorActionState } from "@/lib/server/actions";
import { createSession } from "@/lib/server/auth/session";
import { isHttpError, isRateLimitError, isValidationError } from "@/lib/server/errors";
import { assertGlobalPostRateLimit } from "@/lib/server/rate-limit/global-rate-limit";

const CallbackSchema = v.object({
	token: v.pipe(v.string(), v.nonEmpty()),
});

export async function callbackAction(formData: FormData): Promise<ActionState> {
	const t = await getTranslations("actions.callbackAction");
	const e = await getTranslations("errors");

	try {
		await assertGlobalPostRateLimit();

		const payload = await v.parseAsync(CallbackSchema, {
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
				registration: false,
			},
			responseType: "raw",
		});

		const token = response.headers.get("authorization");

		assert(token);

		await createSession(token);
	} catch (error) {
		log.error(error);

		// TODO: don't return error message but redirect back to sign-in page with server toast

		if (isRateLimitError(error)) {
			return createErrorActionState({ message: e("too-many-requests"), formData });
		}

		if (isValidationError<typeof CallbackSchema>(error)) {
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

	redirect("/");
}
