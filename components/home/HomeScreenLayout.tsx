import css from "@/components/home/HomeScreenLayout.module.css";

import type { ReactNode } from "react";

export interface HomeScreenLayoutProps {
	children?: ReactNode;
}

export function HomeScreenLayout(props: HomeScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
