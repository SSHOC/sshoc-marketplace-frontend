import { VocabularySearchField } from "@/components/account/VocabularySearchField";
import css from "@/components/account/VocabularySearchResultsHeader.module.css";
import { VocabularySearchResultsPageNavigation } from "@/components/account/VocabularySearchResultsPageNavigation";

export function VocabularySearchResultsHeader(): JSX.Element {
	return (
		<aside className={css["container"]}>
			<VocabularySearchField />
			<VocabularySearchResultsPageNavigation variant="input" />
		</aside>
	);
}
