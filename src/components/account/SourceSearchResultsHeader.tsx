import type { ReactNode } from "react";

import { CreateSourceButton } from "@/components/account/CreateSourceButton";
import { SourceSearchField } from "@/components/account/SourceSearchField";
import css from "@/components/account/SourceSearchResultsHeader.module.css";
import { SourceSearchResultsPageNavigation } from "@/components/account/SourceSearchResultsPageNavigation";
import { SourcesSearchSortOrderSelect } from "@/components/account/SourcesSearchSortOrderSelect";

export function SourceSearchResultsHeader(): ReactNode {
	return (
		<aside className={css["container"]}>
			<CreateSourceButton />
			<SourcesSearchSortOrderSelect />
			<SourceSearchField />
			<SourceSearchResultsPageNavigation variant="input" />
		</aside>
	);
}
