import { useUserSearchFilters } from "@/components/account/useUserSearchFilters";
import { useUsers } from "@/data/sshoc/hooks/user";

export function useUserSearchResults() {
	const searchFilters = useUserSearchFilters();
	const sourceSearch = useUsers(searchFilters);

	return sourceSearch;
}
