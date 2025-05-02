import type { ReactNode } from "react";

import { useUserSearchResults } from "@/components/account/useUserSearchResults";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function UsersBackgroundFetchIndicator(): ReactNode {
	const searchResults = useUserSearchResults();

	if (!searchResults.isFetching) {
		return null;
	}

	return <LoadingIndicator />;
}
