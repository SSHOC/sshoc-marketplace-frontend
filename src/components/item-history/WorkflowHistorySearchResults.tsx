import { ItemHistorySearchResults } from "@/components/item-history/ItemHistorySearchResults";
import type { Workflow } from "@/data/sshoc/api/workflow";
import { useWorkflowHistory } from "@/data/sshoc/hooks/workflow";
import { isNotFoundError } from "@/data/sshoc/utils/isNotFoundError";
import type { QueryMetadata } from "@/lib/core/query/types";

export interface WorkflowHistorySearchResultsProps {
	persistentId: Workflow["persistentId"];
}

export function WorkflowHistorySearchResults(
	props: WorkflowHistorySearchResultsProps,
): JSX.Element {
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

	const items = useWorkflowHistory({ persistentId }, undefined, { meta });

	return <ItemHistorySearchResults items={items} />;
}
