import type { ReactNode } from "react";

import { useActorSearch } from "@/components/account/useActorSearch";
import { useActorSearchFilters } from "@/components/account/useActorSearchFilters";
import { useActorSearchResults } from "@/components/account/useActorSearchResults";
import { Pagination } from "@/components/common/Pagination";

export interface ActorSearchResultsPageNavigationProps {
	/** @default 'primary' */
	variant?: "input" | "primary";
}

export function ActorSearchResultsPageNavigation(
	props: ActorSearchResultsPageNavigationProps,
): ReactNode {
	const searchResults = useActorSearchResults();
	const searchFilters = useActorSearchFilters();
	const { getSearchActorsLink, searchActors } = useActorSearch();

	const variant = props.variant ?? "primary";

	return (
		<Pagination
			searchFilters={searchFilters}
			searchResults={searchResults}
			getSearchItemsLink={getSearchActorsLink}
			searchItems={searchActors}
			variant={variant}
		/>
	);
}
