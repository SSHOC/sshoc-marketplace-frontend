import "server-only";

import { assert } from "@acdh-oeaw/lib";
import { decodeJwt, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";

import { env } from "@/config/env.config";
import { UnauthorizedError } from "@/lib/server/errors";

const sessionCookieName = "sshoc-sign-up";

function decode(token: string): JWTPayload | null {
	try {
		return decodeJwt(token);
	} catch {
		return null;
	}
}

export async function createRegistrationSession(token: string): Promise<boolean> {
	const validated = validateRegistrationSessionToken(token);

	if (validated == null) {
		return false;
	}

	(await cookies()).set(sessionCookieName, validated.token, {
		httpOnly: true,
		sameSite: "lax",
		secure: env.NODE_ENV === "production",
		expires: validated.expires,
		path: "/",
	});

	return true;
}

export function validateRegistrationSessionToken(
	token: string,
): { token: string; expires: number } | null {
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

export async function invalidateRegistrationSession(): Promise<void> {
	(await cookies()).delete(sessionCookieName);
}

export const getRegistrationSession = cache(async function getRegistrationSession(): Promise<
	string | null
> {
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	const token = (await cookies()).get(sessionCookieName)?.value || null;

	if (token == null) {
		return null;
	}

	return validateRegistrationSessionToken(token)?.token ?? null;
});

export async function assertRegistrationSession(): Promise<string> {
	const token = await getRegistrationSession();

	assert(token != null, () => {
		return new UnauthorizedError();
	});

	return token;
}
