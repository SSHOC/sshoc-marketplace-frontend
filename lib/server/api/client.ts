import "server-only";

import { createUrl, request } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";
import { assertCurrentSession } from "@/lib/server/auth/session";

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
	const token = await assertCurrentSession();

	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/api/auth/me",
	});

	const data = (await request(url, {
		headers: { authorization: token },
		responseType: "json",
	})) as UserAccount;

	return data;
}
