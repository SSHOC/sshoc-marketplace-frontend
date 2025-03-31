"use client";

import { type ReactNode, useEffect } from "react";

import { redirect } from "@/lib/navigation/navigation";

export function ErrorHandler(): ReactNode {
	useEffect(() => {
		const hash = window.location.hash;

		if (!hash) {
			redirect("/auth/sign-in");
		}
	}, []);

	return null;
}
