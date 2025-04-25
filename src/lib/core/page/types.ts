import type { LinkProps } from "next/link";

export interface NavItem {
	id: string;
	label: string;
	href: LinkProps["href"];
}

export type NavItems = Array<NavItem>;
