import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useVocabularySearch } from "@/components/account/useVocabularySearch";
import { SearchField } from "@/lib/core/ui/SearchField/SearchField";

export function VocabularySearchField(): ReactNode {
	const t = useTranslations();
	const { searchVocabularies } = useVocabularySearch();

	function onSubmit(value: string) {
		searchVocabularies({ q: value });
	}

	return (
		<SearchField aria-label={t("authenticated.concepts.search-concepts")} onSubmit={onSubmit} />
	);
}
