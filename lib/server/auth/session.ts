import { cookies } from "next/headers";

import { env } from "@/config/env.config";

const sessionCookieName = "sshoc";

export async function setSession(token: string): Promise<void> {
	(await cookies()).set(sessionCookieName, token, {
		httpOnly: true,
		sameSite: "lax",
		secure: env.NODE_ENV === "production",
	});
}

export async function getSession(): Promise<string | undefined> {
	return (await cookies()).get(sessionCookieName)?.value;
}

export async function clearSession(): Promise<void> {
	(await cookies()).delete(sessionCookieName);
}
