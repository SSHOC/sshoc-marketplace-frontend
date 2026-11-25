import css from "@/components/account/ActorSearchResultsFooter.module.css";

import type { ReactNode } from "react";

import { ActorSearchResultsPageNavigation } from "@/components/account/ActorSearchResultsPageNavigation";

export function ActorSearchResultsFooter(): ReactNode {
	return (
		<aside className={css["container"]}>
			<div className={css["input"]}>
				<ActorSearchResultsPageNavigation variant="input" />
			</div>
			<div className={css["long"]}>
				<ActorSearchResultsPageNavigation />
			</div>
		</aside>
	);
}
