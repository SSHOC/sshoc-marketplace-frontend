import type { ItemCategory } from "@/data/sshoc/api/item";
import { useItemCategories } from "@/data/sshoc/hooks/item";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { itemRoutes as routes } from "@/lib/core/navigation/item-routes";
import type { NavItems } from "@/lib/core/page/types";
import { keys } from "@/lib/utils";

export function useCreateItemLinks(): NavItems | null {
	const { t } = useI18n<"common">();
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
				label: t(["common", "create-new-item"], {
					values: { item: t(["common", "item-categories", category, "one"]) },
				}),
				href: routes.ItemCreatePage(category)(),
			};
		});

	return items;
}
