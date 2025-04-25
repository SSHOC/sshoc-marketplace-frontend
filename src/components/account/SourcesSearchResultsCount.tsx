import type { ReactNode } from "react";

import { useSourceSearchResults } from "@/components/account/useSourceSearchResults";
import { ItemsCount } from "@/components/common/ItemsCount";

export function SourcesSearchResultsCount(): ReactNode {
	const searchResults = useSourceSearchResults();

	if (searchResults.data == null || searchResults.data.hits === 0 || searchResults.isFetching) {
		return null;
	}

	return <ItemsCount count={searchResults.data.hits} />;
}
