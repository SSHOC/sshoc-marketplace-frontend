import { useDraftItemsSearchResults } from "@/components/account/useDraftItemsSearchResults";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function DraftItemsBackgroundFetchIndicator(): JSX.Element | null {
	const searchResults = useDraftItemsSearchResults();

	if (!searchResults.isFetching) {
		return null;
	}

	return <LoadingIndicator />;
}
