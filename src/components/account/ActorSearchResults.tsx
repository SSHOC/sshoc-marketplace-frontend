import type { ReactNode } from "react";

import { ActorSearchResult } from "@/components/account/ActorSearchResult";
import css from "@/components/account/ActorSearchResults.module.css";
import { useActorSearchResults } from "@/components/account/useActorSearchResults";
import { NoSearchResultsFound } from "@/components/common/NoSearchResultsFound";
import { Centered } from "@/lib/core/ui/Centered/Centered";
import { LoadingIndicator } from "@/lib/core/ui/LoadingIndicator/LoadingIndicator";

export function ActorSearchResults(): ReactNode {
	const actorSearch = useActorSearchResults();

	if (actorSearch.data == null) {
		return (
			<section className={css["container"]} data-state="loading">
				<Centered>
					<LoadingIndicator />
				</Centered>
			</section>
		);
	}

	if (actorSearch.data.actors.length === 0) {
		return (
			<section className={css["container"]} data-state="empty">
				<NoSearchResultsFound />
			</section>
		);
	}

	return (
		<section className={css["container"]}>
			<ul role="list" className={css["search-results"]}>
				{actorSearch.data.actors.map((actor) => {
					return (
						<li key={actor.id}>
							<ActorSearchResult actor={actor} />
						</li>
					);
				})}
			</ul>
		</section>
	);
}
