import type { ReactNode } from "react";

import css from "@/components/account/VocabularySearchResultsFooter.module.css";
import { VocabularySearchResultsPageNavigation } from "@/components/account/VocabularySearchResultsPageNavigation";

export function VocabularySearchResultsFooter(): ReactNode {
	return (
		<aside className={css["container"]}>
			<div className={css["input"]}>
				<VocabularySearchResultsPageNavigation variant="input" />
			</div>
			<div className={css["long"]}>
				<VocabularySearchResultsPageNavigation />
			</div>
		</aside>
	);
}
