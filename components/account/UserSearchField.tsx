import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useUserSearch } from "@/components/account/useUserSearch";
import { SearchField } from "@/lib/core/ui/SearchField/SearchField";

export function UserSearchField(): ReactNode {
	const t = useTranslations();
	const { searchUsers } = useUserSearch();

	function onSubmit(value: string) {
		searchUsers({ q: value });
	}

	return <SearchField aria-label={t("authenticated.users.search-users")} onSubmit={onSubmit} />;
}
