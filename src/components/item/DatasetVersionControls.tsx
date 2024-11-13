import { ItemVersionControls } from "@/components/item/ItemVersionControls";
import type { Dataset } from "@/lib/data/sshoc/api/dataset";
import type { ItemStatus } from "@/lib/data/sshoc/api/item";

export interface DatasetVersionControlsProps {
  persistentId: Dataset["persistentId"];
  status: ItemStatus;
  versionId: Dataset["id"];
}

export function DatasetVersionControls(
  props: DatasetVersionControlsProps
): JSX.Element {
  const { persistentId, status, versionId } = props;

  return (
    <ItemVersionControls
      category="dataset"
      persistentId={persistentId}
      status={status}
      versionId={versionId}
    />
  );
}
