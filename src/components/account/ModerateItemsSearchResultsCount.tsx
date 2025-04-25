import { useModerateItemsSearchResults } from "@/components/account/useModerateItemsSearchResults";
import { ItemsCount } from "@/components/common/ItemsCount";

export function ModerateItemsSearchResultsCount(): JSX.Element | null {
	const searchResults = useModerateItemsSearchResults();

	if (searchResults.data == null || searchResults.data.hits === 0 || searchResults.isFetching) {
		return null;
	}

	return <ItemsCount count={searchResults.data.hits} />;
}
