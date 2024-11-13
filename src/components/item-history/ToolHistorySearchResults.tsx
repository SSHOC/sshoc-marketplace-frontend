import { ItemHistorySearchResults } from "@/components/item-history/ItemHistorySearchResults";
import type { Tool } from "@/lib/data/sshoc/api/tool-or-service";
import { useToolHistory } from "@/lib/data/sshoc/hooks/tool-or-service";
import { isNotFoundError } from "@/lib/data/sshoc/utils/isNotFoundError";
import type { QueryMetadata } from "@/lib/core/query/types";

export interface ToolHistorySearchResultsProps {
  persistentId: Tool["persistentId"];
}

export function ToolHistorySearchResults(
  props: ToolHistorySearchResultsProps
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

  const items = useToolHistory({ persistentId }, undefined, { meta });

  return <ItemHistorySearchResults items={items} />;
}
