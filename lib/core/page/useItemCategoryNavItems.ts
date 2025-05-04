import { createUrlSearchParams } from "@stefanprobst/request";
import { useTranslations } from "next-intl";

import type { ItemCategory } from "@/data/sshoc/api/item";
import { useItemCategories } from "@/data/sshoc/hooks/item";
import type { NavigationLink } from "@/lib/core/page/PageNavigation";
import { keys } from "@/lib/utils";

export function useItemCategoryNavItems(): Array<NavigationLink> {
	const t = useTranslations();
	const itemCategories = useItemCategories();

	if (itemCategories.data == null) {
		return [];
	}

	const items: Array<NavigationLink> = keys(itemCategories.data)
		.filter((category): category is ItemCategory => {
			return category !== "step";
		})
		.map((category) => {
			return {
				type: "link",
				label: t(`common.item-categories.${category}.other`),
				href: `/search?${createUrlSearchParams({ categories: [category] })}`,
			};
		});

	return items;
}
