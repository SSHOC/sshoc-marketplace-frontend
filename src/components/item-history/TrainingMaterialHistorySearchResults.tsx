import { ItemHistorySearchResults } from "@/components/item-history/ItemHistorySearchResults";
import type { TrainingMaterial } from "@/lib/data/sshoc/api/training-material";
import { useTrainingMaterialHistory } from "@/lib/data/sshoc/hooks/training-material";
import { isNotFoundError } from "@/lib/data/sshoc/utils/isNotFoundError";
import type { QueryMetadata } from "@/lib/core/query/types";

export interface TrainingMaterialHistorySearchResultsProps {
  persistentId: TrainingMaterial["persistentId"];
}

export function TrainingMaterialHistorySearchResults(
  props: TrainingMaterialHistorySearchResultsProps
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

  const items = useTrainingMaterialHistory({ persistentId }, undefined, {
    meta,
  });

  return <ItemHistorySearchResults items={items} />;
}
