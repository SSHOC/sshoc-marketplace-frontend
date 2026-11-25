import { useTranslations } from "next-intl";
import type { Key, ReactNode } from "react";

import { useSourceSearch } from "@/components/account/useSourceSearch";
import { useSourceSearchFilters } from "@/components/account/useSourceSearchFilters";
import type { SourceSortOrder } from "@/data/sshoc/api/source";
import { sourceSortOrders } from "@/data/sshoc/api/source";
import { Select } from "@/lib/core/ui/Select/Select";
import { SelectItem } from "@/lib/core/ui/Select/SelectItem";

export function SourcesSearchSortOrderSelect(): ReactNode {
	const t = useTranslations();
	const searchFilters = useSourceSearchFilters();
	const sortOrder = searchFilters.order;
	const { searchSources } = useSourceSearch();

	const items = sourceSortOrders.map((id) => {
		return {
			id,
			label: t("authenticated.sources.sort-by", {
				order: t(`authenticated.sources.sort-orders.${id}`),
			}),
		};
	});

	function onChange(key: Key | null) {
		if (key === null) return;
		const searchParams = { ...searchFilters, order: key as SourceSortOrder };
		searchSources(searchParams);
	}

	return (
		<Select
			aria-label={t("authenticated.sources.sort-order")}
			items={items}
			onSelectionChange={onChange}
			selectedKey={sortOrder}
		>
			{(item) => {
				return <SelectItem>{item.label}</SelectItem>;
			}}
		</Select>
	);
}
