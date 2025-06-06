import type { ReactNode } from "react";

import { UserSearchField } from "@/components/account/UserSearchField";
import css from "@/components/account/UserSearchResultsHeader.module.css";
import { UserSearchResultsPageNavigation } from "@/components/account/UserSearchResultsPageNavigation";
import { UsersSearchSortOrderSelect } from "@/components/account/UsersSearchSortOrderSelect";

export function UserSearchResultsHeader(): ReactNode {
	return (
		<aside className={css["container"]}>
			<UsersSearchSortOrderSelect />
			<UserSearchField />
			<UserSearchResultsPageNavigation variant="input" />
		</aside>
	);
}
