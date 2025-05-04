import type { NavItems } from "@/lib/core/page/types";
import _contributePages from "@/public/data/contribute-pages.json";

const contributePages = _contributePages as Array<{
	label: string;
	href: string;
	position: number;
}>;

export function useContributeNavItems(): NavItems {
	const items = contributePages.map((page) => {
		return {
			type: "link" as const,
			id: page.label,
			label: page.label,
			href: page.href,
		};
	});

	return items;
}
