import { useSourceSearchResults } from "@/components/account/useSourceSearchResults";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function SourcesBackgroundFetchIndicator(): JSX.Element | null {
	const searchResults = useSourceSearchResults();

	if (!searchResults.isFetching) {
		return null;
	}

	return <LoadingIndicator />;
}
