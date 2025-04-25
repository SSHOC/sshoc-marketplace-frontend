import { Item } from "@react-stately/collections";
import type { Key } from "react";

import { useDraftItemsSearch } from "@/components/account/useDraftItemsSearch";
import { useDraftItemsSearchFilters } from "@/components/account/useDraftItemsSearchFilters";
import type { ItemDraftSortOrder } from "@/data/sshoc/api/item";
import { itemDraftSortOrders } from "@/data/sshoc/api/item";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { Select } from "@/lib/core/ui/Select/Select";

export function DraftItemsSearchSortOrderSelect(): JSX.Element {
	const { t } = useI18n<"authenticated">();
	const searchFilters = useDraftItemsSearchFilters();
	const sortOrder = searchFilters.order;
	const { searchDraftItems } = useDraftItemsSearch();

	const items = itemDraftSortOrders.map((id) => {
		return {
			id,
			label: t(["authenticated", "draft-items", "sort-by"], {
				values: { order: t(["authenticated", "draft-items", "sort-orders", id]) },
			}),
		};
	});

	function onChange(key: Key) {
		const searchParams = { ...searchFilters, order: key as ItemDraftSortOrder };
		searchDraftItems(searchParams);
	}

	return (
		<Select
			aria-label={t(["authenticated", "draft-items", "sort-order"])}
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
