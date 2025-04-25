import { ItemVersionControls } from "@/components/item/ItemVersionControls";
import type { ItemStatus } from "@/data/sshoc/api/item";
import type { Tool } from "@/data/sshoc/api/tool-or-service";

export interface ToolOrServiceVersionControlsProps {
	persistentId: Tool["persistentId"];
	status: ItemStatus;
	versionId: Tool["id"];
}

export function ToolOrServiceVersionControls(
	props: ToolOrServiceVersionControlsProps,
): JSX.Element {
	const { persistentId, status, versionId } = props;

	return (
		<ItemVersionControls
			category="tool-or-service"
			persistentId={persistentId}
			status={status}
			versionId={versionId}
		/>
	);
}
