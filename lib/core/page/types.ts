export interface NavItem {
	type: "link";
	id: string;
	label: string;
	href: string;
}

export type NavItems = Array<NavItem>;
