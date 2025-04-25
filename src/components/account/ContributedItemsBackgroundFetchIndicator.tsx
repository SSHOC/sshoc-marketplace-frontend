import { useContributedItemsSearchResults } from "@/components/account/useContributedItemsSearchResults";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function ContributedItemsBackgroundFetchIndicator(): JSX.Element | null {
	const searchResults = useContributedItemsSearchResults();

	if (!searchResults.isFetching) {
		return null;
	}

	return <LoadingIndicator />;
}
