import { ItemVersionControls } from "@/components/item/ItemVersionControls";
import type { ItemStatus } from "@/lib/data/sshoc/api/item";
import type { Publication } from "@/lib/data/sshoc/api/publication";

export interface PublicationVersionControlsProps {
  persistentId: Publication["persistentId"];
  status: ItemStatus;
  versionId: Publication["id"];
}

export function PublicationVersionControls(
  props: PublicationVersionControlsProps
): JSX.Element {
  const { persistentId, status, versionId } = props;

  return (
    <ItemVersionControls
      category="publication"
      persistentId={persistentId}
      status={status}
      versionId={versionId}
    />
  );
}
