import { useDraftItemsSearchFilters } from "@/components/account/useDraftItemsSearchFilters";
import { useDraftItems } from "@/data/sshoc/hooks/item";

export function useDraftItemsSearchResults() {
	const searchFilters = useDraftItemsSearchFilters();
	const draftItemsSearch = useDraftItems(searchFilters);

	return draftItemsSearch;
}
