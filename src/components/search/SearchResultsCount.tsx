import { ItemsCount } from "@/components/common/ItemsCount";
import { useSearchResults } from "@/components/search/useSearchResults";

export function SearchResultsCount(): JSX.Element | null {
	const searchResults = useSearchResults();

	if (searchResults.data == null || searchResults.data.hits === 0 || searchResults.isFetching) {
		return null;
	}

	return <ItemsCount count={searchResults.data.hits} />;
}
