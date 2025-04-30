import type { ReactNode } from "react";

import css from "@/components/account/ContributedItemSearchResultsHeader.module.css";
import { ContributedItemSearchResultsPageNavigation } from "@/components/account/ContributedItemSearchResultsPageNavigation";
import { ContributedItemsSearchSortOrderSelect } from "@/components/account/ContributedItemsSearchSortOrderSelect";

export function ContributedItemSearchResultsHeader(): ReactNode {
	return (
		<aside className={css["container"]}>
			<ContributedItemsSearchSortOrderSelect />
			<ContributedItemSearchResultsPageNavigation variant="input" />
		</aside>
	);
}
