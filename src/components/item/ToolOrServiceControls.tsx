import type { ReactNode } from "react";

import { ItemControls } from "@/components/item/ItemControls";
import type { Tool } from "@/data/sshoc/api/tool-or-service";

export interface ToolOrServiceControlsProps {
	persistentId: Tool["persistentId"];
}

export function ToolOrServiceControls(props: ToolOrServiceControlsProps): ReactNode {
	const { persistentId } = props;

	return <ItemControls category="tool-or-service" persistentId={persistentId} />;
}
