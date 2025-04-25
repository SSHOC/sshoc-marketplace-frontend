import { useActorSearchResults } from "@/components/account/useActorSearchResults";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function ActorsBackgroundFetchIndicator(): JSX.Element | null {
	const searchResults = useActorSearchResults();

	if (!searchResults.isFetching) {
		return null;
	}

	return <LoadingIndicator />;
}
