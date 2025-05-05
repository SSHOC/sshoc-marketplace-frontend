import type { ReactNode } from "react";

export interface SectionHeaderProps {
	children?: ReactNode;
}

export function SectionHeader(props: SectionHeaderProps): ReactNode {
	return (
		<div className="flex items-baseline justify-between border-b border-neutral-150 pb-4">
			{props.children}
		</div>
	);
}
