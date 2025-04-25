import type { ReactNode } from "react";

import css from "@/components/account/SourceSearchResultsFooter.module.css";
import { SourceSearchResultsPageNavigation } from "@/components/account/SourceSearchResultsPageNavigation";

export function SourceSearchResultsFooter(): ReactNode {
	return (
		<aside className={css["container"]}>
			<div className={css["input"]}>
				<SourceSearchResultsPageNavigation variant="input" />
			</div>
			<div className={css["long"]}>
				<SourceSearchResultsPageNavigation />
			</div>
		</aside>
	);
}
