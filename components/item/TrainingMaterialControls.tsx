import type { ReactNode } from "react";

import { ItemControls } from "@/components/item/ItemControls";
import type { TrainingMaterial } from "@/data/sshoc/api/training-material";

export interface TrainingMaterialControlsProps {
	persistentId: TrainingMaterial["persistentId"];
}

export function TrainingMaterialControls(props: TrainingMaterialControlsProps): ReactNode {
	const { persistentId } = props;

	return <ItemControls category="training-material" persistentId={persistentId} />;
}
