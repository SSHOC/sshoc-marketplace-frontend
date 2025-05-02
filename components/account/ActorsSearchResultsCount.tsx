import type { ReactNode } from "react";

import { useActorSearchResults } from "@/components/account/useActorSearchResults";
import { ItemsCount } from "@/components/common/ItemsCount";

export function ActorsSearchResultsCount(): ReactNode {
	const searchResults = useActorSearchResults();

	if (searchResults.data == null || searchResults.data.hits === 0 || searchResults.isFetching) {
		return null;
	}

	return <ItemsCount count={searchResults.data.hits} />;
}
