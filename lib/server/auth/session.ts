import "server-only";

import { assert } from "@acdh-oeaw/lib";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";

import { env } from "@/config/env.config";
import { UnauthorizedError } from "@/lib/server/errors";

const sessionCookieName = "sshoc";

function decode(token: string) {
	try {
		return decodeJwt(token);
	} catch {
		return null;
	}
}

export async function createSession(token: string) {
	const validated = validateSessionToken(token);

	if (validated == null) {
		return;
	}

	(await cookies()).set(sessionCookieName, validated.token, {
		httpOnly: true,
		sameSite: "lax",
		secure: env.NODE_ENV === "production",
		expires: validated.expires,
		path: "/",
	});
}

export function validateSessionToken(token: string) {
	const decoded = decode(token);

	if (decoded?.exp == null) {
		return null;
	}

	const expires = decoded.exp * 1000;

	if (Date.now() >= expires) {
		return null;
	}

	return { token, expires };
}

export async function invalidateSession() {
	(await cookies()).delete(sessionCookieName);
}

export async function getSession() {
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	const token = (await cookies()).get(sessionCookieName)?.value || null;

	if (token == null) {
		return null;
	}

	return validateSessionToken(token)?.token ?? null;
}

export async function assertSession() {
	const token = await getSession();

	assert(token != null, () => {
		return new UnauthorizedError();
	});

	return token;
}
