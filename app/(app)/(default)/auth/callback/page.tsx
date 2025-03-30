"use client";

import { type ReactNode, startTransition, useEffect } from "react";

import { callbackAction } from "@/app/(app)/(default)/auth/callback/_actions/callback-action";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { MainContent } from "@/components/ui/main-content";
import { redirect } from "@/lib/navigation/navigation";

/**
 * Callback for oauth flow (success case). Needs to be a client component because the backend sends
 * the token via url fragment. That's also the reason why we cannot use an api route
 * as the callback url.
 */
export default function CallbackPage(): ReactNode {
	useEffect(() => {
		const hash = window.location.hash;

		if (!hash) {
			redirect("/auth/sign-in");
		}

		const token = hash.slice(1);

		const formData = new FormData();
		formData.set("token", token);

		startTransition(async () => {
			await callbackAction(formData);
		});
	}, []);

	return (
		<MainContent className="grid place-content-center">
			<LoadingIndicator />
		</MainContent>
	);
}
