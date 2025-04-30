import type { ReactNode } from "react";

import css from "@/components/account/DraftItemSearchResultsHeader.module.css";
import { DraftItemSearchResultsPageNavigation } from "@/components/account/DraftItemSearchResultsPageNavigation";
import { DraftItemsSearchSortOrderSelect } from "@/components/account/DraftItemsSearchSortOrderSelect";

export function DraftItemSearchResultsHeader(): ReactNode {
	return (
		<aside className={css["container"]}>
			<DraftItemsSearchSortOrderSelect />
			<DraftItemSearchResultsPageNavigation variant="input" />
		</aside>
	);
}
