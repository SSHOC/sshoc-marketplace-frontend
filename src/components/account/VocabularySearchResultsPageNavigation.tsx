import type { ReactNode } from "react";

import { useVocabularySearch } from "@/components/account/useVocabularySearch";
import { useVocabularySearchFilters } from "@/components/account/useVocabularySearchFilters";
import { useVocabularySearchResults } from "@/components/account/useVocabularySearchResults";
import { Pagination } from "@/components/common/Pagination";

export interface VocabularySearchResultsPageNavigationProps {
	/** @default 'primary' */
	variant?: "input" | "primary";
}

export function VocabularySearchResultsPageNavigation(
	props: VocabularySearchResultsPageNavigationProps,
): ReactNode {
	const searchResults = useVocabularySearchResults();
	const searchFilters = useVocabularySearchFilters();
	const { getSearchVocabulariesLink, searchVocabularies } = useVocabularySearch();

	const variant = props.variant ?? "primary";

	return (
		<Pagination
			searchFilters={searchFilters}
			searchResults={searchResults}
			getSearchItemsLink={getSearchVocabulariesLink}
			searchItems={searchVocabularies}
			variant={variant}
		/>
	);
}
