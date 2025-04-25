import type { ReactNode } from "react";

import css from "@/components/item/WorkflowVersionScreenLayout.module.css";

export interface WorkflowVersionScreenLayoutProps {
	children?: ReactNode;
}

export function WorkflowVersionScreenLayout(props: WorkflowVersionScreenLayoutProps): JSX.Element {
	return <div className={css["layout"]}>{props.children}</div>;
}
