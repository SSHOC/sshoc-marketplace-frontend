import type { ReactNode } from "react";

import css from "@/components/account/ContributedItemSearchResultsFooter.module.css";
import { ContributedItemSearchResultsPageNavigation } from "@/components/account/ContributedItemSearchResultsPageNavigation";

export function ContributedItemSearchResultsFooter(): ReactNode {
	return (
		<aside className={css["container"]}>
			<div className={css["input"]}>
				<ContributedItemSearchResultsPageNavigation variant="input" />
			</div>
			<div className={css["long"]}>
				<ContributedItemSearchResultsPageNavigation />
			</div>
		</aside>
	);
}
