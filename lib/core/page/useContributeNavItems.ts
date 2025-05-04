import type { NavigationLink } from "@/lib/core/page/PageNavigation";
import _contributePages from "@/public/data/contribute-pages.json";

const contributePages = _contributePages as Array<{
	label: string;
	href: string;
	position: number;
}>;

export function useContributeNavItems(): Array<NavigationLink> {
	const items: Array<NavigationLink> = contributePages.map((page) => {
		return {
			type: "link",
			label: page.label,
			href: page.href,
		};
	});

	return items;
}
