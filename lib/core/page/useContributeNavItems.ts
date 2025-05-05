import navigation from "@/content/navigation/index.json";
import type { NavigationLink } from "@/lib/core/page/PageNavigation";

export function useContributeNavItems(): Array<NavigationLink> {
	const items: Array<NavigationLink> = navigation["contribute-pages"].items.map((page) => {
		return {
			type: "link",
			label: page.label,
			href: `/contribute/${page.id}`,
		};
	});

	return items;
}
