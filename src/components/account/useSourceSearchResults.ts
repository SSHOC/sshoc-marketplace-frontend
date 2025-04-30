import { useSourceSearchFilters } from "@/components/account/useSourceSearchFilters";
import { useSources } from "@/data/sshoc/hooks/source";

export function useSourceSearchResults() {
	const searchFilters = useSourceSearchFilters();
	const sourceSearch = useSources(searchFilters);

	return sourceSearch;
}
