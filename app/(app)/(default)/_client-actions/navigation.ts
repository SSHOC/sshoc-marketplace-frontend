"use client";

import { startTransition } from "react";

import { signOutAction } from "@/app/(app)/(default)/_actions/sign-out-action";

export function signOut(): void {
	startTransition(async () => {
		await signOutAction();
		/** Reload page to ensure all in-memory caches are cleared. */
		window.location.reload();
	});
}
