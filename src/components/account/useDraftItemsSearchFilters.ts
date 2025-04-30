import { useMemo } from "react";

import type { GetDraftItems } from "@/data/sshoc/api/item";
import { isItemDraftSortOrder } from "@/data/sshoc/api/item";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { toPositiveInteger } from "@/lib/utils";
import { defaultDraftItemSortOrder } from "~/config/sshoc.config";

export type SearchFilters = Pick<GetDraftItems.SearchParams, "order" | "page">;

export function useDraftItemsSearchFilters(): Required<SearchFilters> {
	const searchParams = useSearchParams();

	const searchFilters = useMemo(() => {
		const defaultSearchFilters: Required<SearchFilters> = {
			page: 1,
			order: defaultDraftItemSortOrder,
		};

		if (searchParams == null) {
			return defaultSearchFilters;
		}

		const _page = searchParams.get("page");
		const page = toPositiveInteger(_page) ?? 1;

		const _order = searchParams.get("order");
		const order =
			_order != null && isItemDraftSortOrder(_order) ? _order : defaultDraftItemSortOrder;

		const searchFilters: Required<SearchFilters> = {
			page,
			order,
		};

		return searchFilters;
	}, [searchParams]);

	return searchFilters;
}
