import { jwtDecode } from "jwt-decode";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect } from "react";

import { useAuth } from "@/lib/core/auth/useAuth";
import { useToast } from "@/lib/core/toast/useToast";

export function useAccessTokenExpirationTimer(): void {
	const t = useTranslations();
	const format = useFormatter();
	const { session } = useAuth();
	const toast = useToast();

	const { token } = session;

	useEffect(() => {
		if (token == null) {
			return;
		}

		const { exp } = jwtDecode(token);
		if (exp == null) {
			return;
		}

		function onTokenTimeout() {
			const message = t("common.token-expiration-warning", {
				time: format.dateTime((exp /** seconds */ as number) * 1000, { timeStyle: "medium" }),
			});
			toast.warn(message);
		}

		const warnBefore = 60 * 1000;
		const delta = Math.max(exp /** seconds */ * 1000 - Date.now() - warnBefore, 0);
		const timeout = window.setTimeout(onTokenTimeout, delta);

		return () => {
			window.clearTimeout(timeout);
		};
	}, [token, t, format, toast]);
}
