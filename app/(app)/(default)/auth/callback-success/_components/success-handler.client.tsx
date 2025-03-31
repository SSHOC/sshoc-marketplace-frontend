import "client-only";

import { type ReactNode, startTransition, useEffect } from "react";

import { callbackSuccessAction } from "@/app/(app)/(default)/auth/callback-success/_actions/callback-success-action";
import { redirect } from "@/lib/navigation/navigation";

export function SuccessHandler(): ReactNode {
	useEffect(() => {
		const hash = window.location.hash;

		if (!hash) {
			redirect("/auth/sign-in");
		}

		const token = hash.slice(1);

		const formData = new FormData();
		formData.set("token", token);

		startTransition(async () => {
			await callbackSuccessAction(formData);
		});
	}, []);

	return null;
}
