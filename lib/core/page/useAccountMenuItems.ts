import { useTranslations } from "next-intl";

import { useAuth } from "@/lib/core/auth/useAuth";
import type { NavigationAction, NavigationLink } from "@/lib/core/page/PageNavigation";

export function useAccountMenuItems(): Array<NavigationLink | NavigationAction> {
	const t = useTranslations();
	const { signOut } = useAuth();

	const items: Array<NavigationLink | NavigationAction> = [
		{
			label: t("common.pages.account"),
			type: "link",
			href: `/account`,
		},
		{
			label: t("common.auth.sign-out"),
			type: "action",
			onAction() {
				signOut();
			},
		},
	];

	return items;
}
