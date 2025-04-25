import { useSourceSearch } from "@/components/account/useSourceSearch";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { SearchField } from "@/lib/core/ui/SearchField/SearchField";

export function SourceSearchField(): JSX.Element {
	const { t } = useI18n<"authenticated">();
	const { searchSources } = useSourceSearch();

	function onSubmit(value: string) {
		searchSources({ q: value });
	}

	return (
		<SearchField
			aria-label={t(["authenticated", "sources", "search-sources"])}
			onSubmit={onSubmit}
		/>
	);
}
