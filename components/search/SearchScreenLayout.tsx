import css from "@/components/search/SearchScreenLayout.module.css";

import type { ReactNode } from "react";

export interface SearchScreenLayoutProps {
	children?: ReactNode;
}

export function SearchScreenLayout(props: SearchScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
