import type { ReactNode } from "react";

import css from "@/components/contribute/ContributeScreenLayout.module.css";

export interface ContributeScreenLayoutProps {
	children?: ReactNode;
}

export function ContributeScreenLayout(props: ContributeScreenLayoutProps): JSX.Element {
	return <div className={css["layout"]}>{props.children}</div>;
}
