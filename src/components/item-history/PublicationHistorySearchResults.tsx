import { ItemHistorySearchResults } from "@/components/item-history/ItemHistorySearchResults";
import type { Publication } from "@/lib/data/sshoc/api/publication";
import { usePublicationHistory } from "@/lib/data/sshoc/hooks/publication";
import { isNotFoundError } from "@/lib/data/sshoc/utils/isNotFoundError";
import type { QueryMetadata } from "@/lib/core/query/types";

export interface PublicationHistorySearchResultsProps {
  persistentId: Publication["persistentId"];
}

export function PublicationHistorySearchResults(
  props: PublicationHistorySearchResultsProps
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

  const items = usePublicationHistory({ persistentId }, undefined, { meta });

  return <ItemHistorySearchResults items={items} />;
}
