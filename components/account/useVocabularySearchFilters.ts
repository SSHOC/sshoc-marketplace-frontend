import { useMemo } from "react";

import type { SearchConcepts } from "@/data/sshoc/api/vocabulary";
import type { ConceptStatus } from "@/data/sshoc/utils/concept";
import { isConceptStatus } from "@/data/sshoc/utils/concept";
import { useSearchParams } from "@/lib/core/navigation/useSearchParams";
import { toPositiveInteger } from "@/lib/utils";

export type SearchFilters = Pick<SearchConcepts.SearchParams, "page" | "q" | "types"> & {
	/**
	 * The backend expect a single boolean `f.candidate` flag, but it's
	 * better to treat it as a status filter list client-side.
	 */
	"f.status"?: Array<ConceptStatus>;
};

export function useVocabularySearchFilters(): Required<SearchFilters> {
	const searchParams = useSearchParams();

	const searchFilters = useMemo(() => {
		const defaultSearchFilters: Required<SearchFilters> = {
			page: 1,
			q: "",
			"f.status": [],
			types: [],
		};

		if (searchParams == null) {
			return defaultSearchFilters;
		}

		const _page = searchParams.get("page");
		const page = toPositiveInteger(_page) ?? 1;

		const _types = searchParams.getAll("types");
		// TODO: Check if valid property type.
		// const types = _types.filter(isPropertyType)
		const types = _types;

		const status = searchParams.getAll("f.status").filter(isConceptStatus);

		const searchFilters: Required<SearchFilters> = {
			page,
			q: searchParams.get("q") ?? "",
			"f.status": status,
			types,
		};

		return searchFilters;
	}, [searchParams]);

	return searchFilters;
}
