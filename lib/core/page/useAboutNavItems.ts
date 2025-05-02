import type { NavItems } from "@/lib/core/page/types";
import _aboutPages from "@/public/data/about-pages.json";

const aboutPages = _aboutPages as Array<{
	label: string;
	href: string;
	position: number;
}>;

export function useAboutNavItems(): NavItems {
	const items = aboutPages.map((page) => {
		return { id: page.label, label: page.label, href: page.href };
	});

	return items;
}
