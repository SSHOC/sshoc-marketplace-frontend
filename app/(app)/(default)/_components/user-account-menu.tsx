"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, startTransition } from "react";
import { MenuItem, MenuTrigger } from "react-aria-components";

import { signOutAction } from "@/app/(app)/(default)/_actions/sign-out-action";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/ui/menu";
import { Popover } from "@/components/ui/popover";
import { createHref } from "@/lib/navigation/create-href";

interface UserAccountMenuProps {
	name: string;
}

export function UserAccountMenu(props: UserAccountMenuProps): ReactNode {
	const { name } = props;

	const t = useTranslations("UserAccountMenu");

	const items = {
		account: {
			href: createHref({ pathname: "/account" }),
			label: "My account",
		},
		"sign-out": {
			label: "Sign out",
		},
	};

	return (
		<MenuTrigger>
			<Button className="min-h-9 rounded-t-none px-16" size="small">
				{t("label", { name })}
			</Button>
			<Popover
				className="min-w-(--trigger-width) rounded-sm border border-neutral-150 bg-neutral-0 shadow entering:animate-popover-bottom-in exiting:animate-popover-bottom-out"
				placement="bottom right"
			>
				<Menu
					className="flex max-h-[inherit] min-w-96 flex-col overflow-auto py-1"
					// selectedKeys={selectedKeys}
				>
					<MenuItem
						className="flex border-l-4 border-neutral-200 px-8 py-6 text-sm text-brand-700 transition hover:border-brand-600 hover:bg-neutral-50 hover:text-brand-600"
						href={items.account.href}
						textValue={items.account.label}
					>
						{items.account.label}
					</MenuItem>
					<MenuItem
						className="flex border-l-4 border-neutral-200 px-8 py-6 text-sm text-brand-700 transition hover:border-brand-600 hover:bg-neutral-50 hover:text-brand-600"
						onAction={() => {
							startTransition(async () => {
								await signOutAction();
							});
						}}
						textValue={items["sign-out"].label}
					>
						{items["sign-out"].label}
					</MenuItem>
				</Menu>
			</Popover>
		</MenuTrigger>
	);
}
