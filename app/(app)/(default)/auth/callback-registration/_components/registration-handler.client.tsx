import "client-only";

import { type ReactNode, startTransition, useEffect } from "react";

import { callbackRegistrationAction } from "@/app/(app)/(default)/auth/callback-registration/_actions/callback-registration-action";
import { redirect } from "@/lib/navigation/navigation";

export function RegistrationHandler(): ReactNode {
	useEffect(() => {
		const hash = window.location.hash;

		if (!hash) {
			redirect("/auth/sign-in");
		}

		const token = hash.slice(1);

		const formData = new FormData();
		formData.set("token", token);

		startTransition(async () => {
			await callbackRegistrationAction(formData);
		});
	}, []);

	return null;
}
