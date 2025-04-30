import type { ReactNode } from "react";

import { ActorSearchField } from "@/components/account/ActorSearchField";
import css from "@/components/account/ActorSearchResultsHeader.module.css";
import { ActorSearchResultsPageNavigation } from "@/components/account/ActorSearchResultsPageNavigation";
import { CreateActorButton } from "@/components/common/CreateActorButton";

export function ActorSearchResultsHeader(): ReactNode {
	return (
		<aside className={css["container"]}>
			<CreateActorButton />
			<ActorSearchField />
			<ActorSearchResultsPageNavigation variant="input" />
		</aside>
	);
}
