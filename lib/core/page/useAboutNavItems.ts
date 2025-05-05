import navigation from "@/content/navigation/index.json";
import type { NavigationLink } from "@/lib/core/page/PageNavigation";

export function useAboutNavItems(): Array<NavigationLink> {
	const items: Array<NavigationLink> = navigation["about-pages"].items.map((page) => {
		return {
			type: "link",
			label: page.label,
			href: `/about/${page.id}`,
		};
	});

	return items;
}
