import type { ReactNode } from "react";

import css from "@/components/account/DraftItemSearchResultsFooter.module.css";
import { DraftItemSearchResultsPageNavigation } from "@/components/account/DraftItemSearchResultsPageNavigation";

export function DraftItemSearchResultsFooter(): ReactNode {
	return (
		<aside className={css["container"]}>
			<div className={css["input"]}>
				<DraftItemSearchResultsPageNavigation variant="input" />
			</div>
			<div className={css["long"]}>
				<DraftItemSearchResultsPageNavigation />
			</div>
		</aside>
	);
}
