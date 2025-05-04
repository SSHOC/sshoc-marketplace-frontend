import { useTranslations } from "next-intl";

import { itemFacets } from "@/data/sshoc/api/item";
import type { NavItems } from "@/lib/core/page/types";

export function useBrowseNavItems(): NavItems {
	const t = useTranslations();

	const items = itemFacets.map((id) => {
		const label = t("common.browse.browse-facet", {
			facet: t(`common.facets.${id}.other`).toLowerCase(),
		});

		const href = `/browse/${id}`;

		return {
			type: "link" as const,
			id,
			label,
			href,
		};
	});

	return items;
}
