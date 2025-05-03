import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useEffect } from "react";
import {
	Button as AriaButton,
	Menu as AriaMenu,
	MenuItem as AriaMenuItem,
	MenuTrigger as AriaMenuTrigger,
} from "react-aria-components";

import { useCurrentUser } from "@/data/sshoc/hooks/auth";
import { useAuth } from "@/lib/core/auth/useAuth";
import css from "@/lib/core/page/AccountMenu.module.css";
import menuStyles from "@/lib/core/page/NavigationMenu.module.css";
import { Popover } from "@/lib/core/page/Popover";
import { useAccountMenuItems } from "@/lib/core/page/useAccountMenuItems";

export function AccountMenu(): ReactNode {
	const t = useTranslations();
	const { isSignedIn } = useAuth();
	const currentUser = useCurrentUser();

	const items = useAccountMenuItems();

	// const router = useRouter();

	// useEffect(() => {
	// 	router.events.on("routeChangeStart", state.close);

	// 	return () => {
	// 		router.events.off("routeChangeStart", state.close);
	// 	};
	// }, [router, state.close]);

	if (!isSignedIn || currentUser.data == null) {
		return null;
	}

	return (
		<div className={css["container"]}>
			<AriaMenuTrigger>
				<AriaButton className={css["menu-button"]}>
					{t("common.auth.account-menu-message", {
						username: currentUser.data.displayName,
					})}
				</AriaButton>
				<Popover>
					<AriaMenu aria-label={t("common.auth.account-menu")} className={menuStyles["nav-menu"]}>
						{items.map((item, index) => {
							if (item.type === "button") {
								return (
									<AriaMenuItem onAction={item.onPress} key={index} data-variant="nav-menu-item">
										{item.label}
									</AriaMenuItem>
								);
							}

							return (
								<AriaMenuItem href={item.href} key={index} data-variant="nav-menu-item">
									{item.label}
								</AriaMenuItem>
							);
						})}
					</AriaMenu>
				</Popover>
			</AriaMenuTrigger>
		</div>
	);
}
