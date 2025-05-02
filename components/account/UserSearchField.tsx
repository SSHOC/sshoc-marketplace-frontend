import type { ReactNode } from "react";

import { useUserSearch } from "@/components/account/useUserSearch";
import { useI18n } from "@/lib/core/i18n/useI18n";
import { SearchField } from "@/lib/core/ui/SearchField/SearchField";

export function UserSearchField(): ReactNode {
	const { t } = useI18n<"authenticated">();
	const { searchUsers } = useUserSearch();

	function onSubmit(value: string) {
		searchUsers({ q: value });
	}

	return (
		<SearchField aria-label={t(["authenticated", "users", "search-users"])} onSubmit={onSubmit} />
	);
}
