import type { ReactNode } from "react";

export interface ItemSearchFormPanelProps {
	children?: ReactNode;
}

export function ItemSearchFormPanel(props: ItemSearchFormPanelProps): ReactNode {
	const { children } = props;

	return <div className="rounded-lg bg-neutral-0 p-2.5 shadow sm:px-8">{children}</div>;
}
