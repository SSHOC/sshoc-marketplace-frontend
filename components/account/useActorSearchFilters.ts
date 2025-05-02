import { useMemo } from "react";

import type { SearchActors } from "@/data/sshoc/api/actor";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { toPositiveInteger } from "@/lib/utils";

export type SearchFilters = Pick<
	SearchActors.SearchParams,
	"d.email" | "d.external-identifier" | "d.name" | "d.website" | "page" | "q"
>;

export function useActorSearchFilters(): Required<SearchFilters> {
	const searchParams = useSearchParams();

	const searchFilters = useMemo(() => {
		const defaultSearchFilters: Required<SearchFilters> = {
			page: 1,
			q: "",
			"d.email": "",
			"d.external-identifier": "",
			"d.name": "",
			"d.website": "",
		};

		if (searchParams == null) {
			return defaultSearchFilters;
		}

		const _page = searchParams.get("page");
		const page = toPositiveInteger(_page) ?? 1;

		const searchFilters: Required<SearchFilters> = {
			page,
			q: searchParams.get("q") ?? "",
			"d.email": searchParams.get("d.email") ?? "",
			"d.external-identifier": searchParams.get("d.external-identifier") ?? "",
			"d.name": searchParams.get("d.name") ?? "",
			"d.website": searchParams.get("d.website") ?? "",
		};

		return searchFilters;
	}, [searchParams]);

	return searchFilters;
}
