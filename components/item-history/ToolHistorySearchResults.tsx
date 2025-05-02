import type { ReactNode } from "react";

import { ItemHistorySearchResults } from "@/components/item-history/ItemHistorySearchResults";
import type { Tool } from "@/data/sshoc/api/tool-or-service";
import { useToolHistory } from "@/data/sshoc/hooks/tool-or-service";
import { isNotFoundError } from "@/data/sshoc/utils/isNotFoundError";
import type { QueryMetadata } from "@/lib/core/query/types";

export interface ToolHistorySearchResultsProps {
	persistentId: Tool["persistentId"];
}

export function ToolHistorySearchResults(props: ToolHistorySearchResultsProps): ReactNode {
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

	const items = useToolHistory({ persistentId }, undefined, { meta });

	return <ItemHistorySearchResults items={items} />;
}
