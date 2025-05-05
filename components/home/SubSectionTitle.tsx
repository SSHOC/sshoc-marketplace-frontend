import type { ReactNode } from "react";

export interface SubSectionTitleProps {
	children?: ReactNode;
	/** @default 3 */
	headingLevel?: 3 | 4 | 5;
}

export function SubSectionTitle(props: SubSectionTitleProps): ReactNode {
	const { headingLevel = 3 } = props;

	const ElementType = `h${headingLevel}` as const;

	return (
		<ElementType className="text-xl font-medium text-neutral-800">{props.children}</ElementType>
	);
}
