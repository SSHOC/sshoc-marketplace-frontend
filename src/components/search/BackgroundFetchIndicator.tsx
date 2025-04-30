import type { ReactNode } from "react";

import { useSearchResults } from "@/components/search/useSearchResults";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function BackgroundFetchIndicator(): ReactNode {
	const searchResults = useSearchResults();

	if (!searchResults.isFetching) {
		return null;
	}

	return <LoadingIndicator />;
}
