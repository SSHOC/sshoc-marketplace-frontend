import type { ReactNode } from "react";

import { UserSearchResult } from "@/components/account/UserSearchResult";
import css from "@/components/account/UserSearchResults.module.css";
import { useUserSearchResults } from "@/components/account/useUserSearchResults";
import { NoSearchResultsFound } from "@/components/common/NoSearchResultsFound";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function UserSearchResults(): ReactNode {
	const userSearch = useUserSearchResults();

	if (userSearch.data == null) {
		return (
			<section className={css["container"]} data-state="loading">
				<Centered>
					<LoadingIndicator />
				</Centered>
			</section>
		);
	}

	if (userSearch.data.users.length === 0) {
		return (
			<section className={css["container"]} data-state="empty">
				<NoSearchResultsFound />
			</section>
		);
	}

	return (
		<section className={css["container"]}>
			<ul role="list" className={css["search-results"]}>
				{userSearch.data.users.map((user) => {
					return (
						<li key={user.id}>
							<UserSearchResult user={user} />
						</li>
					);
				})}
			</ul>
		</section>
	);
}
