import css from "@/components/common/SearchResultControls.module.css";

import type { ReactNode } from "react";

export interface SearchResultControlsProps {
	children?: ReactNode;
}

export function SearchResultControls(props: SearchResultControlsProps): ReactNode {
	const { children } = props;

	return <div className={css["container"]}>{children}</div>;
}
