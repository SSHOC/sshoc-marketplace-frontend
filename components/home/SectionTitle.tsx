import type { ReactNode } from "react";

export interface SectionTitleProps {
	children?: ReactNode;
	/** @default 2 */
	headingLevel?: 3 | 4 | 5;
}

export function SectionTitle(props: SectionTitleProps): ReactNode {
	const { headingLevel = 2 } = props;

	const ElementType = `h${headingLevel}` as const;

	return (
		<ElementType className="text-2xl font-medium text-neutral-800">{props.children}</ElementType>
	);
}
