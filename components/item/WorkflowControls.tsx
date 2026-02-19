import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { LinkButton } from "@/components/common/LinkButton";
import { ItemControls } from "@/components/item/ItemControls";
import css from "@/components/item/ItemControls.module.css";
import type { Workflow } from "@/data/sshoc/api/workflow";
import { useCurrentUser } from "@/data/sshoc/hooks/auth";
import { itemRoutes } from "@/lib/core/navigation/item-routes";

export interface WorkflowControlsProps {
	persistentId: Workflow["persistentId"];
}

export function WorkflowControls(props: WorkflowControlsProps): ReactNode {
	const { persistentId } = props;

	const t = useTranslations();

	const currentUser = useCurrentUser();

	/**
	 * Workflow version history is publicly accessible to unauthenticated users, to be able to view
	 * the workflow version a handle pid resolves to.
	 */
	if (currentUser.data == null) {
		return (
			<div className={css["container"]}>
				<LinkButton
					href={itemRoutes.ItemHistoryPage("workflow")({ persistentId })}
					color="secondary"
					size="xs"
				>
					{t("common.controls.history")}
				</LinkButton>
			</div>
		);
	}

	return <ItemControls category="workflow" persistentId={persistentId} />;
}
