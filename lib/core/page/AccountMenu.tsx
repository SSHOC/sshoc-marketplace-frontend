import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useEffect } from "react";
import {
	Button as AriaButton,
	Menu as AriaMenu,
	MenuItem as AriaMenuItem,
	MenuTrigger as AriaMenuTrigger,
	Popover as AriaPopover,
} from "react-aria-components";

import { useCurrentUser } from "@/data/sshoc/hooks/auth";
import { useAuth } from "@/lib/core/auth/useAuth";
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
		<div className="relative inline-flex">
			<AriaMenuTrigger>
				<AriaButton className="rounded-b-sm bg-primary-750 px-16 py-2 text-sm font-medium text-neutral-50 hover:bg-primary-600 focus-visible:bg-primary-600 aria-expanded:bg-primary-600">
					{t("common.auth.account-menu-message", {
						username: currentUser.data.displayName,
					})}
				</AriaButton>
				<AriaPopover offset={8} placement="bottom">
					<AriaMenu className="flex w-max min-w-96 flex-col gap-y-1 rounded-sm border border-neutral-200 bg-neutral-0 py-1 text-md shadow">
						{items.map((item, index) => {
							if (item.type === "button") {
								return (
									<AriaMenuItem
										className="flex border-l-4 border-neutral-200 px-8 py-6 text-primary-700 hover:border-primary-600 hover:bg-neutral-50 hover:text-primary-600 focus-visible:border-primary-600 focus-visible:bg-neutral-50 focus-visible:text-primary-600"
										onAction={item.onPress}
										key={index}
									>
										{item.label}
									</AriaMenuItem>
								);
							}

							return (
								<AriaMenuItem
									className="flex border-l-4 border-neutral-200 px-8 py-6 text-primary-700 hover:border-primary-600 hover:bg-neutral-50 hover:text-primary-600 focus-visible:border-primary-600 focus-visible:bg-neutral-50 focus-visible:text-primary-600"
									href={item.href}
									key={index}
								>
									{item.label}
								</AriaMenuItem>
							);
						})}
					</AriaMenu>
				</AriaPopover>
			</AriaMenuTrigger>
		</div>
	);
}
