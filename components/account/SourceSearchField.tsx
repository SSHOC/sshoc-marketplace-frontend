import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useSourceSearch } from "@/components/account/useSourceSearch";
import { SearchField } from "@/lib/core/ui/SearchField/SearchField";

export function SourceSearchField(): ReactNode {
	const t = useTranslations();
	const { searchSources } = useSourceSearch();

	function onSubmit(value: string) {
		searchSources({ q: value });
	}

	return <SearchField aria-label={t("authenticated.sources.search-sources")} onSubmit={onSubmit} />;
}
