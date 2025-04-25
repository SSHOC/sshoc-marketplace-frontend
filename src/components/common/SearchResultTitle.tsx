import type { ReactNode } from "react";

import css from "@/components/common/SearchResultTitle.module.css";

export interface SearchResultTitleProps {
	children?: ReactNode;
	/** @default 3 */
	headingLevel?: 3 | 4 | 5;
}

export function SearchResultTitle(props: SearchResultTitleProps): JSX.Element {
	const { children, headingLevel = 3 } = props;

	const ElementType = `h${headingLevel}` as const;

	return <ElementType className={css["title"]}>{children}</ElementType>;
}
