import "server-only";

import { assert } from "@acdh-oeaw/lib";
import { decodeJwt, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";

import { env } from "@/config/env.config";
import { UnauthorizedError } from "@/lib/server/errors";

const sessionCookieName = "sshoc";

function decode(token: string): JWTPayload | null {
	try {
		return decodeJwt(token);
	} catch {
		return null;
	}
}

export async function createSession(token: string): Promise<void> {
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

export function validateSessionToken(token: string): { token: string; expires: number } | null {
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

export async function invalidateSession(): Promise<void> {
	(await cookies()).delete(sessionCookieName);
}

export const getSession = cache(async function getSession(): Promise<string | null> {
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	const token = (await cookies()).get(sessionCookieName)?.value || null;

	if (token == null) {
		return null;
	}

	return validateSessionToken(token)?.token ?? null;
});

export async function assertSession(): Promise<string> {
	const token = await getSession();

	assert(token != null, () => {
		return new UnauthorizedError();
	});

	return token;
}

export async function isAuthenticated(): Promise<boolean> {
	const token = await getSession();

	return token != null;
}

// export async function assertAuthenticated(): Promise<void> {
// 	const token = await getSession();

// 	assert(token != null);
// }
