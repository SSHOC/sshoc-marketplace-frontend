import type { ReactNode } from "react";

import { useModerateItemsSearch } from "@/components/account/useModerateItemsSearch";
import { useModerateItemsSearchFilters } from "@/components/account/useModerateItemsSearchFilters";
import { useModerateItemsSearchResults } from "@/components/account/useModerateItemsSearchResults";
import { Pagination } from "@/components/common/Pagination";

export interface ModerateItemSearchResultsPageNavigationProps {
	/** @default 'primary' */
	variant?: "input" | "primary";
}

export function ModerateItemSearchResultsPageNavigation(
	props: ModerateItemSearchResultsPageNavigationProps,
): ReactNode {
	const searchResults = useModerateItemsSearchResults();
	const searchFilters = useModerateItemsSearchFilters();
	const { getSearchModerateItemsLink, searchModerateItems } = useModerateItemsSearch();

	const variant = props.variant ?? "primary";

	return (
		<Pagination
			searchFilters={searchFilters}
			searchResults={searchResults}
			getSearchItemsLink={getSearchModerateItemsLink}
			searchItems={searchModerateItems}
			variant={variant}
		/>
	);
}
