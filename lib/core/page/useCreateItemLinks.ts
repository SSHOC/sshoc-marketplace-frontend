import { useTranslations } from "next-intl";

import type { ItemCategory } from "@/data/sshoc/api/item";
import { useItemCategories } from "@/data/sshoc/hooks/item";
import { itemRoutes as routes } from "@/lib/core/navigation/item-routes";
import type { NavItems } from "@/lib/core/page/types";
import { keys } from "@/lib/utils";

export function useCreateItemLinks(): NavItems | null {
	const t = useTranslations();
	const itemCategories = useItemCategories();

	if (itemCategories.data == null) {
		return null;
	}

	const items = keys(itemCategories.data)
		.filter((category): category is ItemCategory => {
			return category !== "step";
		})
		.map((category) => {
			return {
				id: category,
				label: t("common.create-new-item", {
					item: t(`common.item-categories.${category}.one`),
				}),
				href: routes.ItemCreatePage(category)(),
			};
		});

	return items;
}
