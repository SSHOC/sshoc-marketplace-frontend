import { useActorSearchFilters } from "@/components/account/useActorSearchFilters";
import { useActorSearch } from "@/data/sshoc/hooks/actor";

export function useActorSearchResults() {
	const searchFilters = useActorSearchFilters();
	const actorSearch = useActorSearch(searchFilters);

	return actorSearch;
}
