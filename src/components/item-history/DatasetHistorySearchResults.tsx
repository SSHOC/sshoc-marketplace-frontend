import { ItemHistorySearchResults } from "@/components/item-history/ItemHistorySearchResults";
import type { Dataset } from "@/lib/data/sshoc/api/dataset";
import { useDatasetHistory } from "@/lib/data/sshoc/hooks/dataset";
import { isNotFoundError } from "@/lib/data/sshoc/utils/isNotFoundError";
import type { QueryMetadata } from "@/lib/core/query/types";

export interface DatasetHistorySearchResultsProps {
  persistentId: Dataset["persistentId"];
}

export function DatasetHistorySearchResults(
  props: DatasetHistorySearchResultsProps
): JSX.Element {
  const { persistentId } = props;

  const meta: QueryMetadata = {
    messages: {
      error(error) {
        if (isNotFoundError(error)) return false;
        return undefined;
      },
    },
  };

  const items = useDatasetHistory({ persistentId }, undefined, { meta });

  return <ItemHistorySearchResults items={items} />;
}
