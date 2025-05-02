import { useMemo } from "react";

import { defaultItemSearchResultsSortOrder } from "@/config/sshoc.config";
import type { ItemSearch } from "@/data/sshoc/api/item";
import { isItemCategory, isItemSortOrder } from "@/data/sshoc/api/item";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { toPositiveInteger } from "@/lib/utils";

export type SearchFilters = Pick<
	ItemSearch.SearchParams,
	"categories" | "f.activity" | "f.keyword" | "f.language" | "f.source" | "order" | "page" | "q"
>;

export function useSearchFilters(): Required<SearchFilters> {
	const searchParams = useSearchParams();

	const searchFilters = useMemo(() => {
		const defaultSearchFilters: Required<SearchFilters> = {
			page: 1,
			order: [defaultItemSearchResultsSortOrder],
			q: "",
			categories: [],
			"f.activity": [],
			"f.keyword": [],
			"f.language": [],
			"f.source": [],
		};

		if (searchParams == null) {
			return defaultSearchFilters;
		}

		const _page = searchParams.get("page");
		const page = toPositiveInteger(_page) ?? 1;

		const _order = searchParams.getAll("order").filter(isItemSortOrder);
		const order = _order.length > 0 ? _order : [defaultItemSearchResultsSortOrder];

		const searchFilters: Required<SearchFilters> = {
			page,
			order,
			q: searchParams.get("q") ?? "",
			categories: searchParams.getAll("categories").filter(isItemCategory),
			"f.activity": searchParams.getAll("f.activity"),
			"f.keyword": searchParams.getAll("f.keyword"),
			"f.language": searchParams.getAll("f.language"),
			"f.source": searchParams.getAll("f.source"),
		};

		return searchFilters;
	}, [searchParams]);

	return searchFilters;
}
