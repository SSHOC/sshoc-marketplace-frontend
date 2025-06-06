import type { ReactNode } from "react";

import css from "@/components/home/HomeScreenLayout.module.css";

export interface HomeScreenLayoutProps {
	children?: ReactNode;
}

export function HomeScreenLayout(props: HomeScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
