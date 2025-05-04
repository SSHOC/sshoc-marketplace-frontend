import { useTranslations } from "next-intl";

import { itemFacets } from "@/data/sshoc/api/item";
import type { NavigationLink } from "@/lib/core/page/PageNavigation";

export function useBrowseNavItems(): Array<NavigationLink> {
	const t = useTranslations();

	const items: Array<NavigationLink> = itemFacets.map((id) => {
		const label = t("common.browse.browse-facet", {
			facet: t(`common.facets.${id}.other`).toLowerCase(),
		});

		const href = `/browse/${id}`;

		return {
			type: "link",
			label,
			href,
		};
	});

	return items;
}
