import type { ReactNode } from "react";

import { useDraftItemsSearchResults } from "@/components/account/useDraftItemsSearchResults";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function DraftItemsBackgroundFetchIndicator(): ReactNode {
	const searchResults = useDraftItemsSearchResults();

	if (!searchResults.isFetching) {
		return null;
	}

	return <LoadingIndicator />;
}
