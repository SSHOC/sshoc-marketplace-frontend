import "server-only";

import { assert } from "@acdh-oeaw/lib";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";

import { env } from "@/config/env.config";
import { UnauthorizedError } from "@/lib/server/errors";

const sessionCookieName = "sshoc";

export async function getSessionToken(): Promise<string | null> {
	return (await cookies()).get(sessionCookieName)?.value ?? null;
}

export async function setSessionTokenCookie(token: string, expires: number): Promise<void> {
	(await cookies()).set(sessionCookieName, token, {
		httpOnly: true,
		sameSite: "lax",
		secure: env.NODE_ENV === "production",
		expires,
		path: "/",
	});
}

export async function clearSessionTokenCookie(): Promise<void> {
	(await cookies()).delete(sessionCookieName);
}

export async function validateSessionToken(token: string): Promise<string | null> {
	const decoded = decodeJwt(token);

	if (decoded.exp == null || Date.now() >= decoded.exp) {
		await clearSessionTokenCookie();

		return null;
	}

	return token;
}

export async function getCurrentSession(): Promise<string | null> {
	const token = await getSessionToken();

	if (token == null) {
		return null;
	}

	return validateSessionToken(token);
}

export async function assertCurrentSession(): Promise<string> {
	const token = await getCurrentSession();

	assert(token, () => {
		return new UnauthorizedError();
	});

	return token;
}
