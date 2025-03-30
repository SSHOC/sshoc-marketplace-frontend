"use server";

import { log } from "@acdh-oeaw/lib";
import { getTranslations } from "next-intl/server";

import { redirect } from "@/lib/navigation/navigation";
import { type ActionState, createErrorActionState } from "@/lib/server/actions";
import { invalidateSession } from "@/lib/server/auth/session";

export async function signOutAction(): Promise<ActionState> {
	const e = await getTranslations("errors");

	try {
		await invalidateSession();
	} catch (error) {
		log.error(error);

		// TODO: don't return error message but display server toast

		return createErrorActionState({ message: e("internal-server-error") });
	}

	redirect("/auth/sign-in");
}
