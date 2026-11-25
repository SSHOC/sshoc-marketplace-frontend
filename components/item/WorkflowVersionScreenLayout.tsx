import css from "@/components/item/WorkflowVersionScreenLayout.module.css";

import type { ReactNode } from "react";

export interface WorkflowVersionScreenLayoutProps {
	children?: ReactNode;
}

export function WorkflowVersionScreenLayout(props: WorkflowVersionScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
