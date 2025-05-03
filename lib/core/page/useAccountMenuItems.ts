import { useTranslations } from "next-intl";

import { useAuth } from "@/lib/core/auth/useAuth";

interface MenuItemBase {
	id: string;
	label: string;
	type: "button" | "link" | "nav-link";
}

interface MenuItemNavLink extends MenuItemBase {
	type: "nav-link";
	href: string;
}

interface MenuItemLink extends MenuItemBase {
	type: "link";
	href: string;
}

interface MenuItemButton extends MenuItemBase {
	type: "button";
	onPress: () => void;
}

type MenuItem = MenuItemButton | MenuItemLink | MenuItemNavLink;

export function useAccountMenuItems(): Array<MenuItem> {
	const t = useTranslations();
	const { signOut } = useAuth();

	const items: Array<MenuItem> = [
		{
			id: "account",
			label: t("common.pages.account"),
			type: "nav-link",
			href: `/account`,
		},
		{
			id: "sign-out",
			label: t("common.auth.sign-out"),
			type: "button",
			onPress() {
				signOut();
			},
		},
	];

	return items;
}
