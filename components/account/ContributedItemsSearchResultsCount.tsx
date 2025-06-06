import type { ReactNode } from "react";

import { useContributedItemsSearchResults } from "@/components/account/useContributedItemsSearchResults";
import { ItemsCount } from "@/components/common/ItemsCount";

export function ContributedItemsSearchResultsCount(): ReactNode {
	const searchResults = useContributedItemsSearchResults();

	if (searchResults.data == null || searchResults.data.hits === 0 || searchResults.isFetching) {
		return null;
	}

	return <ItemsCount count={searchResults.data.hits} />;
}
