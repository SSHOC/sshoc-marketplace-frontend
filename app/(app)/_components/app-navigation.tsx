"use client";

// eslint-disable-next-line no-restricted-imports
import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "react-aria-components";

import { NavLink } from "@/app/(app)/_components/nav-link";
import type { LinkProps } from "@/components/link";

interface NavigationLink {
	type: "link";
	href: LinkProps["href"];
	label: string;
}

interface NavigationSeparator {
	type: "separator";
}

interface NavigationMenu {
	type: "menu";
	label: string;
	children: Record<string, NavigationLink | NavigationSeparator>;
}

export type NavigationItem = NavigationLink | NavigationSeparator | NavigationMenu;

interface AppNavigationProps {
	label: string;
	navigation: { home: NavigationLink } & Record<string, NavigationItem>;
}

export function AppNavigation(props: AppNavigationProps): ReactNode {
	const { label, navigation } = props;

	return (
		<nav aria-label={label}>
			<ul className="flex items-center gap-4 text-sm" role="list">
				{Object.entries(navigation).map(([id, item]) => {
					switch (item.type) {
						case "link": {
							if (id === "home") {
								return (
									<li key={id}>
										<NavLink href={item.href}>
											<Image alt="" priority={true} src="/assets/images/logo-with-text.svg" />
											<span className="sr-only">{item.label}</span>
										</NavLink>
									</li>
								);
							}

							return (
								<li key={id}>
									<NavLink href={item.href}>{item.label}</NavLink>
								</li>
							);
						}

						case "separator": {
							return <li key={id} role="separator" />;
						}

						case "menu": {
							return (
								<li key={id}>
									<Button>{item.label}</Button>
								</li>
							);
						}
					}
				})}
			</ul>
		</nav>
	);
}
