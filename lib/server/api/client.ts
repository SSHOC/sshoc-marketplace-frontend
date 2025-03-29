import "server-only";

import { createUrl, request } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";
import { assertCurrentSession } from "@/lib/server/auth/session";

export async function getCurrentUser() {
	const token = await assertCurrentSession();

	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/api/auth/me",
	});

	const response = await request(url, {
		headers: { authorization: token },
		responseType: "json",
	});

	return response;
}
