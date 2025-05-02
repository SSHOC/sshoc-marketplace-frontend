import type { ReactNode } from "react";

import { useContributedItemsSearchResults } from "@/components/account/useContributedItemsSearchResults";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function ContributedItemsBackgroundFetchIndicator(): ReactNode {
	const searchResults = useContributedItemsSearchResults();

	if (!searchResults.isFetching) {
		return null;
	}

	return <LoadingIndicator />;
}
