import css from "@/components/contribute/ContributeScreenLayout.module.css";

import type { ReactNode } from "react";

export interface ContributeScreenLayoutProps {
	children?: ReactNode;
}

export function ContributeScreenLayout(props: ContributeScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
