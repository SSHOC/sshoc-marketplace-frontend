import css from "@/components/search/SearchResultsHeader.module.css";
import { SearchResultsPageNavigation } from "@/components/search/SearchResultsPageNavigation";
import { SearchSortOrderSelect } from "@/components/search/SearchSortOrderSelect";

export function SearchResultsHeader(): JSX.Element {
	return (
		<aside className={css["container"]}>
			<SearchSortOrderSelect />
			<SearchResultsPageNavigation variant="input" />
		</aside>
	);
}
