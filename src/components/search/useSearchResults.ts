import { useSearchFilters } from "@/components/search/useSearchFilters";
import { useItemSearch } from "@/data/sshoc/hooks/item";

export function useSearchResults() {
	const searchFilters = useSearchFilters();
	const itemSearch = useItemSearch(searchFilters);

	return itemSearch;
}
