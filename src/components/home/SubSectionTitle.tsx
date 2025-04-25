import type { ReactNode } from "react";

import css from "@/components/home/SubSectionTitle.module.css";

export interface SubSectionTitleProps {
	children?: ReactNode;
	/** @default 3 */
	headingLevel?: 3 | 4 | 5;
}

export function SubSectionTitle(props: SubSectionTitleProps): ReactNode {
	const { headingLevel = 3 } = props;

	const ElementType = `h${headingLevel}` as const;

	return <ElementType className={css["title"]}>{props.children}</ElementType>;
}
