import { Item } from "@react-stately/collections";
import type { Key } from "react";

import { useSearchItems } from "@/components/common/useSearchItems";
import { useSearchFilters } from "@/components/search/useSearchFilters";
import type { ItemSortOrder } from "@/data/sshoc/api/item";
import { itemSortOrders } from "@/data/sshoc/api/item";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { Select } from "@/lib/core/ui/Select/Select";

export function SearchSortOrderSelect(): JSX.Element {
	const { t } = useI18n<"common">();
	const searchFilters = useSearchFilters();
	const sortOrder = searchFilters.order[0];
	const { searchItems } = useSearchItems();

	const items = itemSortOrders.map((id) => {
		return {
			id,
			label: t(["common", "search", "sort-by"], {
				values: { order: t(["common", "search", "sort-orders", id]) },
			}),
		};
	});

	function onChange(key: Key) {
		const searchParams = { ...searchFilters, order: [key as ItemSortOrder] };
		searchItems(searchParams);
	}

	return (
		<Select
			aria-label={t(["common", "search", "sort-order"])}
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
