import { useSourceSearchResults } from "@/components/account/useSourceSearchResults";
import { ItemsCount } from "@/components/common/ItemsCount";

export function SourcesSearchResultsCount(): JSX.Element | null {
	const searchResults = useSourceSearchResults();

	if (searchResults.data == null || searchResults.data.hits === 0 || searchResults.isFetching) {
		return null;
	}

	return <ItemsCount count={searchResults.data.hits} />;
}
