import css from "@/components/account/ModerateItemSearchResultsHeader.module.css";
import { ModerateItemSearchResultsPageNavigation } from "@/components/account/ModerateItemSearchResultsPageNavigation";
import { ModerateItemsSearchSortOrderSelect } from "@/components/account/ModerateItemsSearchSortOrderSelect";

export function ModerateItemSearchResultsHeader(): JSX.Element {
	return (
		<aside className={css["container"]}>
			<ModerateItemsSearchSortOrderSelect />
			<ModerateItemSearchResultsPageNavigation variant="input" />
		</aside>
	);
}
