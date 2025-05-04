import { useTranslations } from "next-intl";

import type { ItemCategory } from "@/data/sshoc/api/item";
import { useItemCategories } from "@/data/sshoc/hooks/item";
import { itemRoutes as routes } from "@/lib/core/navigation/item-routes";
import type { NavigationLink } from "@/lib/core/page/PageNavigation";
import { keys } from "@/lib/utils";

export function useCreateItemLinks(): Array<NavigationLink> {
	const t = useTranslations();
	const itemCategories = useItemCategories();

	if (itemCategories.data == null) {
		return [];
	}

	const items: Array<NavigationLink> = keys(itemCategories.data)
		.filter((category): category is ItemCategory => {
			return category !== "step";
		})
		.map((category): NavigationLink => {
			return {
				type: "link",
				label: t("common.create-new-item", {
					item: t(`common.item-categories.${category}.one`),
				}),
				href: routes.ItemCreatePage(category)(),
			};
		});

	return items;
}
