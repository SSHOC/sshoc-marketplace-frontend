import { Item } from "@react-stately/collections";
import { useTranslations } from "next-intl";
import type { Key, ReactNode } from "react";

import { useSearchItems } from "@/components/common/useSearchItems";
import { useSearchFilters } from "@/components/search/useSearchFilters";
import type { ItemSortOrder } from "@/data/sshoc/api/item";
import { itemSortOrders } from "@/data/sshoc/api/item";
import { Select } from "@/lib/core/ui/Select/Select";

export function SearchSortOrderSelect(): ReactNode {
	const t = useTranslations();
	const searchFilters = useSearchFilters();
	const sortOrder = searchFilters.order[0];
	const { searchItems } = useSearchItems();

	const items = itemSortOrders.map((id) => {
		return {
			id,
			label: t("common.search.sort-by", {
				order: t(`common.search.sort-orders.${id}`),
			}),
		};
	});

	function onChange(key: Key) {
		const searchParams = { ...searchFilters, order: [key as ItemSortOrder] };
		searchItems(searchParams);
	}

	return (
		<Select
			aria-label={t("common.search.sort-order")}
			items={items}
			onSelectionChange={onChange}
			selectedKey={sortOrder}
		>
			{(item) => {
				return <Item>{item.label}</Item>;
			}}
		</Select>
	);
}
