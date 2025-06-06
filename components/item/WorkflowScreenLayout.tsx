import type { ReactNode } from "react";

import css from "@/components/item/WorkflowScreenLayout.module.css";

export interface WorkflowScreenLayoutProps {
	children?: ReactNode;
}

export function WorkflowScreenLayout(props: WorkflowScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
