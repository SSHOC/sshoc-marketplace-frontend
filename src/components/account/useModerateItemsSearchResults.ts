import type { SearchFilters } from "@/components/account/useModerateItemsSearchFilters";
import { useModerateItemsSearchFilters } from "@/components/account/useModerateItemsSearchFilters";
import { useItemSearch } from "@/data/sshoc/hooks/item";
import { convertDynamicPropertySearchParams } from "@/data/sshoc/lib/convertDynamicPropertySearchParams";
import { entries } from "@/lib/utils";

export function useModerateItemsSearchResults() {
	const searchFilters = useModerateItemsSearchFilters();
	const normalizedSearchFilters = normalizeSearchFilters(searchFilters);
	const searchParams = convertDynamicPropertySearchParams(normalizedSearchFilters);
	const contributedItemsSearch = useItemSearch(searchParams);

	return contributedItemsSearch;
}

function normalizeSearchFilters(filters: SearchFilters) {
	const searchFilters = {} as any;

	entries(filters).forEach(([key, value]) => {
		switch (key) {
			case "d.curation": {
				if (Array.isArray(value)) {
					value.forEach((flag) => {
						searchFilters[`d.curation-flag-${flag}`] = "true";
					});
				}
				break;
			}

			case "d.lastInfoUpdate": {
				if (Array.isArray(value)) {
					searchFilters["d.lastInfoUpdate"] = value.map((date) => {
						return `[${new Date(date).toISOString()} TO NOW]`;
					});
				}
				break;
			}

			case "d.deprecated-at-source": {
				if (value === true) {
					searchFilters["d.deprecated-at-source"] = "true";
				}
				break;
			}

			case "d.conflict-at-source": {
				if (value === true) {
					searchFilters["d.conflict-at-source"] = "true";
				}
				break;
			}

			default:
				searchFilters[key] = value;
		}
	});

	return searchFilters;
}
