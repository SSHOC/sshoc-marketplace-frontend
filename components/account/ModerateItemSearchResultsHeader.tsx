import css from "@/components/account/ModerateItemSearchResultsHeader.module.css";

import type { ReactNode } from "react";

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
