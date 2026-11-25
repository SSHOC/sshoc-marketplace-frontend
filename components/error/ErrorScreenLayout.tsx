import css from "@/components/error/ErrorScreenLayout.module.css";

import type { ReactNode } from "react";

export interface ErrorScreenLayoutProps {
	children?: ReactNode;
}

export function ErrorScreenLayout(props: ErrorScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
