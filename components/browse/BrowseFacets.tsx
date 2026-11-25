import css from "@/components/browse/BrowseFacets.module.css";

import type { ReactNode } from "react";

export interface BrowseFacetsProps {
	children?: ReactNode;
}

export function BrowseFacets(props: BrowseFacetsProps): ReactNode {
	return <div className={css["container"]}>{props.children}</div>;
}
