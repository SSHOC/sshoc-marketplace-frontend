import type { ReactNode } from "react";

import { ItemControls } from "@/components/item/ItemControls";
import type { Dataset } from "@/data/sshoc/api/dataset";

export interface DatasetControlsProps {
	persistentId: Dataset["persistentId"];
}

export function DatasetControls(props: DatasetControlsProps): ReactNode {
	const { persistentId } = props;

	return <ItemControls category="dataset" persistentId={persistentId} />;
}
