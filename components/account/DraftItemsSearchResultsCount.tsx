import type { ReactNode } from "react";

import { useDraftItemsSearchResults } from "@/components/account/useDraftItemsSearchResults";
import { ItemsCount } from "@/components/common/ItemsCount";

export function DraftItemsSearchResultsCount(): ReactNode {
	const searchResults = useDraftItemsSearchResults();

	if (searchResults.data == null || searchResults.data.hits === 0 || searchResults.isFetching) {
		return null;
	}

	return <ItemsCount count={searchResults.data.hits} />;
}
