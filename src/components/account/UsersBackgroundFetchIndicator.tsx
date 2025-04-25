import { useUserSearchResults } from "@/components/account/useUserSearchResults";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function UsersBackgroundFetchIndicator(): JSX.Element | null {
	const searchResults = useUserSearchResults();

	if (!searchResults.isFetching) {
		return null;
	}

	return <LoadingIndicator />;
}
