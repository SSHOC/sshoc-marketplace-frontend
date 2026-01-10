import type { ReactNode } from "react";

export interface PageMainContentProps {
	children?: ReactNode;
}

export function PageMainContent(props: PageMainContentProps): ReactNode {
	const id = "main-content";

	return (
		<main className="outline-transparent [grid-area:page-main-content]" id={id} tabIndex={-1}>
			{props.children}
		</main>
	);
}
