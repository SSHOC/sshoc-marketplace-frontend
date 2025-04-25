import type { ReactNode } from "react";

import css from "@/components/common/SectionTitle.module.css";

export interface SectionTitleProps {
	children?: ReactNode;
	/** @default 2 */
	headingLevel?: 2 | 3 | 4;
}

export function SectionTitle(props: SectionTitleProps): JSX.Element {
	const { headingLevel = 2 } = props;

	const ElementType = `h${headingLevel}` as const;

	return <ElementType className={css["title"]}>{props.children}</ElementType>;
}
