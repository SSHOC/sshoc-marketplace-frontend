import type { ReactNode } from "react";

import css from "@/lib/core/page/PageMainContent.module.css";

export interface PageMainContentProps {
	children?: ReactNode;
}

export function PageMainContent(props: PageMainContentProps): ReactNode {
	return (
		<main className={css["container"]} id="main-content" tabIndex={-1}>
			{props.children}
		</main>
	);
}
