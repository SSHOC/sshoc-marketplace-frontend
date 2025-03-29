import "server-only";

import { assert } from "@acdh-oeaw/lib";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";

import { env } from "@/config/env.config";
import { UnauthorizedError } from "@/lib/server/errors";

const sessionCookieName = "sshoc";

async function getSessionToken(): Promise<string | null> {
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	return (await cookies()).get(sessionCookieName)?.value || null;
}

export async function setSessionTokenCookie(token: string): Promise<void> {
	const decoded = decodeJwt(token);

	if (decoded.exp == null) {
		return;
	}

	const expires = decoded.exp * 1000;

	if (Date.now() >= expires) {
		return;
	}

	(await cookies()).set(sessionCookieName, token, {
		httpOnly: true,
		sameSite: "lax",
		secure: env.NODE_ENV === "production",
		expires,
		path: "/",
	});
}

export async function deleteSessionTokenCookie(): Promise<void> {
	(await cookies()).delete(sessionCookieName);
}

function validateSessionToken(token: string): string | null {
	const decoded = decodeJwt(token);

	if (decoded.exp == null) {
		return null;
	}

	const expires = decoded.exp * 1000;

	if (Date.now() >= expires) {
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
