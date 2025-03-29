import "server-only";

import { createUrl, request } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";
import { redirect } from "@/lib/navigation/navigation";
import { assertSession, invalidateSession } from "@/lib/server/auth/session";
import { isUnauthorizedError } from "@/lib/server/errors";

interface UserAccount {
	id: number;
	username: string;
	displayName: string;
	status: "enabled";
	registrationDate: string;
	role: "administrator" | "moderator" | "contributor";
	email: string;
	config: true;
}

export async function getCurrentUser() {
	try {
		const token = await assertSession();

		const url = createUrl({
			baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
			pathname: "/api/auth/me",
		});

		const data = (await request(url, {
			headers: { authorization: token },
			responseType: "json",
		})) as UserAccount;

		return data;
	} catch (error) {
		if (isUnauthorizedError(error)) {
			// FIXME: only allowed in server action
			// await invalidateSession();
		}

		redirect("/auth/sign-in");
	}
}
