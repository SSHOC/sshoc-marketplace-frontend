"use client";

import { startTransition } from "react";

import { signOutAction } from "@/app/(app)/(default)/_actions/sign-out-action";

export function signOut() {
	startTransition(async () => {
		await signOutAction();
	});
}
