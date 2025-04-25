import type { ReactNode } from "react";

import css from "@/components/account/ModerateItemSearchResultsHeader.module.css";
import { ModerateItemSearchResultsPageNavigation } from "@/components/account/ModerateItemSearchResultsPageNavigation";
import { ModerateItemsSearchSortOrderSelect } from "@/components/account/ModerateItemsSearchSortOrderSelect";

export function ModerateItemSearchResultsHeader(): ReactNode {
	return (
		<aside className={css["container"]}>
			<ModerateItemsSearchSortOrderSelect />
			<ModerateItemSearchResultsPageNavigation variant="input" />
		</aside>
	);
}
