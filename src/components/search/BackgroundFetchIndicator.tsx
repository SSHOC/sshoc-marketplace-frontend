import { useSearchResults } from "@/components/search/useSearchResults";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function BackgroundFetchIndicator(): JSX.Element | null {
	const searchResults = useSearchResults();

	if (!searchResults.isFetching) {
		return null;
	}

	return <LoadingIndicator />;
}
