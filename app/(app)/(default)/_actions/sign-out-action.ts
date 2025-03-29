"use server";

import { revalidatePath } from "next/cache";

import { deleteSessionTokenCookie } from "@/lib/server/auth/session";

export async function signOutAction() {
	await deleteSessionTokenCookie();

	revalidatePath("/");
}
