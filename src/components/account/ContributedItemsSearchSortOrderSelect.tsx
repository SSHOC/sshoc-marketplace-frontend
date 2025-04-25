import { Item } from "@react-stately/collections";
import type { Key } from "react";

import { useContributedItemsSearch } from "@/components/account/useContributedItemsSearch";
import { useContributedItemsSearchFilters } from "@/components/account/useContributedItemsSearchFilters";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { Select } from "@/lib/core/ui/Select/Select";
import type { ContributedItemSortOrder } from "~/config/sshoc.config";
import { contributedItemsSortOrder } from "~/config/sshoc.config";

export function ContributedItemsSearchSortOrderSelect(): JSX.Element {
	const { t } = useI18n<"common">();
	const searchFilters = useContributedItemsSearchFilters();
	const sortOrder = searchFilters.order;
	const { searchContributedItems } = useContributedItemsSearch();

	const items = contributedItemsSortOrder.map((id) => {
		return {
			id,
			label: t(["common", "search", "sort-by"], {
				values: { order: t(["common", "search", "sort-orders", id]) },
			}),
		};
	});

	function onChange(key: Key) {
		const searchParams = { ...searchFilters, order: key as ContributedItemSortOrder };
		searchContributedItems(searchParams);
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
