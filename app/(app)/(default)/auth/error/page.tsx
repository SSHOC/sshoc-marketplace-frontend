"use client";

import { type ReactNode, useEffect } from "react";

import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { MainContent } from "@/components/ui/main-content";
import { redirect } from "@/lib/navigation/navigation";

/**
 * Callback for oauth flow (error case). Needs to be a client component because the backend
 * sends the token via url fragment. That's also the reason why we cannot use an api route
 * as the callback url.
 */
export default function ErrorPage(): ReactNode {
	useEffect(() => {
		const hash = window.location.hash;

		if (!hash) {
			redirect("/auth/sign-in");
		}
	}, []);

	return (
		<MainContent className="grid place-content-center">
			<LoadingIndicator />
		</MainContent>
	);
}
