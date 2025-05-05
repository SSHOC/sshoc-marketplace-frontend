import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

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
			<Link
				className="-mt-px rounded-b-sm bg-primary-750 px-16 py-2.5 text-sm font-medium text-neutral-0 transition hover:bg-primary-600 focus-visible:bg-primary-600"
				href="/auth/sign-in"
			>
				{t("common.auth.sign-in")}
			</Link>
		);
	}

	return null;
}
