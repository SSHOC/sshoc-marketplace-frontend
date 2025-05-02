import { useMemo } from "react";

import {
	defaultContributedItemsSortOrder,
	isContributedItemSortOrder,
} from "@/config/sshoc.config";
import type { GetContributedItems } from "@/data/sshoc/api/item";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { toPositiveInteger } from "@/lib/utils";

export type SearchFilters = Omit<GetContributedItems.Params, "perpage">;

export function useContributedItemsSearchFilters(): Required<SearchFilters> {
	const searchParams = useSearchParams();

	const searchFilters = useMemo(() => {
		const defaultSearchFilters: Required<SearchFilters> = {
			page: 1,
			order: defaultContributedItemsSortOrder,
		};

		if (searchParams == null) {
			return defaultSearchFilters;
		}

		const _page = searchParams.get("page");
		const page = toPositiveInteger(_page) ?? 1;

		const _order = searchParams.get("order");
		const order =
			_order != null && isContributedItemSortOrder(_order)
				? _order
				: defaultContributedItemsSortOrder;

		const searchFilters: Required<SearchFilters> = {
			page,
			order,
		};

		return searchFilters;
	}, [searchParams]);

	return searchFilters;
}
