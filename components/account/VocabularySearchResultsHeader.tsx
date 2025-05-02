import type { ReactNode } from "react";

import { VocabularySearchField } from "@/components/account/VocabularySearchField";
import css from "@/components/account/VocabularySearchResultsHeader.module.css";
import { VocabularySearchResultsPageNavigation } from "@/components/account/VocabularySearchResultsPageNavigation";

export function VocabularySearchResultsHeader(): ReactNode {
	return (
		<aside className={css["container"]}>
			<VocabularySearchField />
			<VocabularySearchResultsPageNavigation variant="input" />
		</aside>
	);
}
