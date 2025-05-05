import type { ReactNode } from "react";

export interface SubSectionHeaderProps {
	children?: ReactNode;
}

export function SubSectionHeader(props: SubSectionHeaderProps): ReactNode {
	return (
		<div className="flex items-baseline justify-between border-b border-neutral-150 py-4">
			{props.children}
		</div>
	);
}
