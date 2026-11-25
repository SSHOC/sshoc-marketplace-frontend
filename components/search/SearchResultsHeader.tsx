import css from "@/components/search/SearchResultsHeader.module.css";

import type { ReactNode } from "react";

import { SearchResultsPageNavigation } from "@/components/search/SearchResultsPageNavigation";
import { SearchSortOrderSelect } from "@/components/search/SearchSortOrderSelect";

export function SearchResultsHeader(): ReactNode {
	return (
		<aside className={css["container"]}>
			<SearchSortOrderSelect />
			<SearchResultsPageNavigation variant="input" />
		</aside>
	);
}
