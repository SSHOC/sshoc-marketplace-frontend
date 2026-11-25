import css from "@/components/browse/BrowseScreenLayout.module.css";

import type { ReactNode } from "react";

export interface BrowseScreenLayoutProps {
	children?: ReactNode;
}

export function BrowseScreenLayout(props: BrowseScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
