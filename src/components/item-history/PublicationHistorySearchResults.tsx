import type { ReactNode } from "react";

import { ItemHistorySearchResults } from "@/components/item-history/ItemHistorySearchResults";
import type { Publication } from "@/data/sshoc/api/publication";
import { usePublicationHistory } from "@/data/sshoc/hooks/publication";
import { isNotFoundError } from "@/data/sshoc/utils/isNotFoundError";
import type { QueryMetadata } from "@/lib/core/query/types";

export interface PublicationHistorySearchResultsProps {
	persistentId: Publication["persistentId"];
}

export function PublicationHistorySearchResults(
	props: PublicationHistorySearchResultsProps,
): ReactNode {
	const { persistentId } = props;

	const meta: QueryMetadata = {
		messages: {
			error(error) {
				if (isNotFoundError(error)) {
					return false;
				}
				return undefined;
			},
		},
	};

	const items = usePublicationHistory({ persistentId }, undefined, { meta });

	return <ItemHistorySearchResults items={items} />;
}
