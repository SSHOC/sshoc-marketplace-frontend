import type { ReactNode } from "react";

import { useContributedItemsSearch } from "@/components/account/useContributedItemsSearch";
import { useContributedItemsSearchFilters } from "@/components/account/useContributedItemsSearchFilters";
import { useContributedItemsSearchResults } from "@/components/account/useContributedItemsSearchResults";
import { Pagination } from "@/components/common/Pagination";

export interface ContributedItemSearchResultsPageNavigationProps {
	/** @default 'primary' */
	variant?: "input" | "primary";
}

export function ContributedItemSearchResultsPageNavigation(
	props: ContributedItemSearchResultsPageNavigationProps,
): ReactNode {
	const searchResults = useContributedItemsSearchResults();
	const searchFilters = useContributedItemsSearchFilters();
	const { getSearchContributedItemsLink, searchContributedItems } = useContributedItemsSearch();

	const variant = props.variant ?? "primary";

	return (
		<Pagination
			searchFilters={searchFilters}
			searchResults={searchResults}
			getSearchItemsLink={getSearchContributedItemsLink}
			searchItems={searchContributedItems}
			variant={variant}
		/>
	);
}
