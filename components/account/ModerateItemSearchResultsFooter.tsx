import type { ReactNode } from "react";

import css from "@/components/account/ModerateItemSearchResultsFooter.module.css";
import { ModerateItemSearchResultsPageNavigation } from "@/components/account/ModerateItemSearchResultsPageNavigation";

export function ModerateItemSearchResultsFooter(): ReactNode {
	return (
		<aside className={css["container"]}>
			<div className={css["input"]}>
				<ModerateItemSearchResultsPageNavigation variant="input" />
			</div>
			<div className={css["long"]}>
				<ModerateItemSearchResultsPageNavigation />
			</div>
		</aside>
	);
}
