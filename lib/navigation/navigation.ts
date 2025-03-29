/* eslint-disable no-restricted-imports */

import Link from "next/link";
import type { ComponentPropsWithRef, FC } from "react";

export { redirect, usePathname, useRouter, useSearchParams } from "next/navigation";

export type LocaleLinkProps = Omit<ComponentPropsWithRef<typeof Link>, "href"> & {
	href: string | undefined;
};

export const LocaleLink = Link as FC<LocaleLinkProps>;

export interface NavigationLink {
	type: "link";
	href: string;
	label: string;
}

export interface NavigationSeparator {
	type: "separator";
}

export interface NavigationMenu {
	type: "menu";
	label: string;
	children: Record<string, NavigationLink | NavigationSeparator>;
}

export type NavigationItem = NavigationLink | NavigationSeparator | NavigationMenu;
