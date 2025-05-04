import type { NavigationLink } from "@/lib/core/page/PageNavigation";
import _aboutPages from "@/public/data/about-pages.json";

const aboutPages = _aboutPages as Array<{
	label: string;
	href: string;
	position: number;
}>;

export function useAboutNavItems(): Array<NavigationLink> {
	const items: Array<NavigationLink> = aboutPages.map((page) => {
		return {
			type: "link",
			label: page.label,
			href: page.href,
		};
	});

	return items;
}
