import { useSourceSearch } from "@/components/account/useSourceSearch";
import { useSourceSearchFilters } from "@/components/account/useSourceSearchFilters";
import { useSourceSearchResults } from "@/components/account/useSourceSearchResults";
import { Pagination } from "@/components/common/Pagination";

export interface SourceSearchResultsPageNavigationProps {
	/** @default 'primary' */
	variant?: "input" | "primary";
}

export function SourceSearchResultsPageNavigation(
	props: SourceSearchResultsPageNavigationProps,
): JSX.Element {
	const searchResults = useSourceSearchResults();
	const searchFilters = useSourceSearchFilters();
	const { getSearchSourcesLink, searchSources } = useSourceSearch();

	const variant = props.variant ?? "primary";

	return (
		<Pagination
			searchFilters={searchFilters}
			searchResults={searchResults}
			getSearchItemsLink={getSearchSourcesLink}
			searchItems={searchSources}
			variant={variant}
		/>
	);
}
