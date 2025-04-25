import { ItemHistorySearchResults } from "@/components/item-history/ItemHistorySearchResults";
import type { Dataset } from "@/data/sshoc/api/dataset";
import { useDatasetHistory } from "@/data/sshoc/hooks/dataset";
import { isNotFoundError } from "@/data/sshoc/utils/isNotFoundError";
import type { QueryMetadata } from "@/lib/core/query/types";

export interface DatasetHistorySearchResultsProps {
	persistentId: Dataset["persistentId"];
}

export function DatasetHistorySearchResults(props: DatasetHistorySearchResultsProps): JSX.Element {
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

	const items = useDatasetHistory({ persistentId }, undefined, { meta });

	return <ItemHistorySearchResults items={items} />;
}
