import type { ReactNode } from "react";

import { ItemControls } from "@/components/item/ItemControls";
import type { Publication } from "@/data/sshoc/api/publication";

export interface PublicationControlsProps {
	persistentId: Publication["persistentId"];
}

export function PublicationControls(props: PublicationControlsProps): ReactNode {
	const { persistentId } = props;

	return <ItemControls category="publication" persistentId={persistentId} />;
}
