import type { ReactNode } from "react";

import { useVocabularySearchResults } from "@/components/account/useVocabularySearchResults";
import { ItemsCount } from "@/components/common/ItemsCount";

export function VocabulariesSearchResultsCount(): ReactNode {
	const searchResults = useVocabularySearchResults();

	if (searchResults.data == null || searchResults.data.hits === 0 || searchResults.isFetching) {
		return null;
	}

	return <ItemsCount count={searchResults.data.hits} />;
}
