import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { NavLinkButton } from "@/components/common/NavLinkButton";
import { useAuth } from "@/lib/core/auth/useAuth";
import { AccountMenu } from "@/lib/core/page/AccountMenu";

export function AuthButton(): ReactNode {
	const t = useTranslations();
	const { isSignedIn, isSignedOut } = useAuth();

	if (isSignedIn) {
		return <AccountMenu />;
	}

	if (isSignedOut) {
		return (
			<NavLinkButton
				href="/auth/sign-in"
				size="sm"
				style={{
					// @ts-expect-error It's fine.
					marginTop: -1,
					"--button-border-width": 0,
					"--button-padding-inline": "var(--space-16)",
					"--button-padding-block": "var(--space-2-5)",
					"--button-border-radius": "0 0 var(--border-radius-md) var(--border-radius-md)",
				}}
			>
				{t("common.auth.sign-in")}
			</NavLinkButton>
		);
	}

	return null;
}
