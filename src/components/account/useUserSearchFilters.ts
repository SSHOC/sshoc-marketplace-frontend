import { useMemo } from "react";

import type { GetUsers } from "@/data/sshoc/api/user";
import { isUserSortOrder } from "@/data/sshoc/api/user";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { toPositiveInteger } from "@/lib/utils";
import { defaultUserSortOrder } from "~/config/sshoc.config";

export type SearchFilters = Pick<GetUsers.SearchParams, "order" | "page" | "q">;

export function useUserSearchFilters(): Required<SearchFilters> {
	const searchParams = useSearchParams();

	const searchFilters = useMemo(() => {
		const defaultSearchFilters: Required<SearchFilters> = {
			page: 1,
			q: "",
			order: defaultUserSortOrder,
		};

		if (searchParams == null) {
			return defaultSearchFilters;
		}

		const _page = searchParams.get("page");
		const page = toPositiveInteger(_page) ?? 1;

		const _order = searchParams.get("order");
		const order = _order != null && isUserSortOrder(_order) ? _order : defaultUserSortOrder;

		const searchFilters: Required<SearchFilters> = {
			page,
			q: searchParams.get("q") ?? "",
			order,
		};

		return searchFilters;
	}, [searchParams]);

	return searchFilters;
}
