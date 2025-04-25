import type { ReactNode } from "react";

import css from "@/components/error/ErrorScreenLayout.module.css";

export interface ErrorScreenLayoutProps {
	children?: ReactNode;
}

export function ErrorScreenLayout(props: ErrorScreenLayoutProps): JSX.Element {
	return <div className={css["layout"]}>{props.children}</div>;
}
