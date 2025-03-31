"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { MenuItem, MenuTrigger } from "react-aria-components";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/ui/menu";
import { Popover } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { type NavigationMenuItem, usePathname } from "@/lib/navigation/navigation";
import { isCurrentPage } from "@/lib/navigation/use-nav-link";

interface UserAccountMenuProps {
	items: Record<string, NavigationMenuItem>;
	label: string;
	name: string;
}

export function UserAccountMenu(props: UserAccountMenuProps): ReactNode {
	const { items, label, name } = props;

	const t = useTranslations("UserAccountMenu");

	const pathname = usePathname();

	/**
	 * Menu items are not announced as links, so we should use selection state
	 * instead of `aria-current`. Unfortunately, we cannot set selection state
	 * on individual menu items, but only on the menu itself.
	 *
	 * @see https://github.com/adobe/react-spectrum/issues/7587
	 */
	const selectedKeys = new Set<string>();
	Object.entries(items).forEach(([id, item]) => {
		if (item.type === "link" && isCurrentPage(item.href, pathname)) {
			selectedKeys.add(id);
		}
	});

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
					selectedKeys={selectedKeys}
					selectionMode="single"
				>
					{Object.entries(items).map(([id, item]) => {
						switch (item.type) {
							case "action": {
								return (
									<MenuItem
										key={id}
										className="flex border-l-4 border-neutral-200 px-8 py-6 text-sm text-brand-700 transition hover:border-brand-600 hover:bg-neutral-50 hover:text-brand-600"
										id={id}
										onAction={item.onAction}
										textValue={item.label}
									>
										{item.label}
									</MenuItem>
								);
							}

							case "link": {
								return (
									<MenuItem
										key={id}
										className="flex border-l-4 border-neutral-200 px-8 py-6 text-sm text-brand-700 transition hover:border-brand-600 hover:bg-neutral-50 hover:text-brand-600"
										href={item.href}
										id={id}
										textValue={item.label}
									>
										{item.label}
									</MenuItem>
								);
							}

							case "separator": {
								return <Separator key={id} className="my-1" id={id} />;
							}
						}
					})}
				</Menu>
			</Popover>
		</MenuTrigger>
	);
}
