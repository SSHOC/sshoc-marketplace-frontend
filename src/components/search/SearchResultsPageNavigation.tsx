import { Pagination } from "@/components/common/Pagination";
import { useSearchItems } from "@/components/common/useSearchItems";
import { useSearchFilters } from "@/components/search/useSearchFilters";
import { useSearchResults } from "@/components/search/useSearchResults";

export interface SearchResultsPageNavigationProps {
	/** @default 'primary' */
	variant?: "input" | "primary";
}

export function SearchResultsPageNavigation(props: SearchResultsPageNavigationProps): JSX.Element {
	const searchResults = useSearchResults();
	const searchFilters = useSearchFilters();
	const { getSearchItemsLink, searchItems } = useSearchItems();

	const variant = props.variant ?? "primary";

	return (
		<Pagination
			searchFilters={searchFilters}
			searchResults={searchResults}
			getSearchItemsLink={getSearchItemsLink}
			searchItems={searchItems}
			variant={variant}
		/>
	);
}
