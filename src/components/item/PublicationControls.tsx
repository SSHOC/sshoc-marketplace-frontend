import { ItemControls } from "@/components/item/ItemControls";
import type { Publication } from "@/lib/data/sshoc/api/publication";

export interface PublicationControlsProps {
  persistentId: Publication["persistentId"];
}

export function PublicationControls(
  props: PublicationControlsProps
): JSX.Element {
  const { persistentId } = props;

  return <ItemControls category="publication" persistentId={persistentId} />;
}
