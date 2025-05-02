import type { ReactNode } from "react";

import { useVocabularySearch } from "@/components/account/useVocabularySearch";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { SearchField } from "@/lib/core/ui/SearchField/SearchField";

export function VocabularySearchField(): ReactNode {
	const { t } = useI18n<"authenticated">();
	const { searchVocabularies } = useVocabularySearch();

	function onSubmit(value: string) {
		searchVocabularies({ q: value });
	}

	return (
		<SearchField
			aria-label={t(["authenticated", "concepts", "search-concepts"])}
			onSubmit={onSubmit}
		/>
	);
}
