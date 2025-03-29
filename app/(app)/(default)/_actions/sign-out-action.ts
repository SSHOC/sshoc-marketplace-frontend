"use server";

import { revalidatePath } from "next/cache";

import { invalidateSession } from "@/lib/server/auth/session";

export async function signOutAction() {
	await invalidateSession();

	revalidatePath("/");
}
