import type { ReactNode } from "react";

import css from "@/components/common/SearchResultContent.module.css";

export interface SearchResultContentProps {
	children?: ReactNode;
}

export function SearchResultContent(props: SearchResultContentProps): ReactNode {
	const { children } = props;

	return <div className={css["content"]}>{children}</div>;
}
