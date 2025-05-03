import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { useActorSearch } from "@/components/account/useActorSearch";
import { SearchField } from "@/lib/core/ui/SearchField/SearchField";

export function ActorSearchField(): ReactNode {
	const t = useTranslations();
	const { searchActors } = useActorSearch();

	function onSubmit(value: string) {
		searchActors({ q: value });
	}

	return <SearchField aria-label={t("authenticated.actors.search-actors")} onSubmit={onSubmit} />;
}
