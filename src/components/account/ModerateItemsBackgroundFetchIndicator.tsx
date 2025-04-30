import type { ReactNode } from "react";

import { useModerateItemsSearchResults } from "@/components/account/useModerateItemsSearchResults";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function ModerateItemsBackgroundFetchIndicator(): ReactNode {
	const searchResults = useModerateItemsSearchResults();

	if (!searchResults.isFetching) {
		return null;
	}

	return <LoadingIndicator />;
}
