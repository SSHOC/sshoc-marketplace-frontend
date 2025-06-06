import type { ReactNode } from "react";

import css from "@/components/success/SuccessScreenLayout.module.css";

export interface SuccessScreenLayoutProps {
	children?: ReactNode;
}

export function SuccessScreenLayout(props: SuccessScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
