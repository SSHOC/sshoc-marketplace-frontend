import type { ReactNode } from "react";

import css from "@/lib/core/page/PageMainContent.module.css";
import { usePage } from "@/lib/core/page/PageProvider";

export interface PageMainContentProps {
	children?: ReactNode;
}

export function PageMainContent(props: PageMainContentProps): ReactNode {
	const { pageLoadingIndicator, skipToMainContent } = usePage();

	return (
		<main
			className={css["container"]}
			{...pageLoadingIndicator.regionProps}
			{...skipToMainContent.targetProps}
		>
			{props.children}
		</main>
	);
}
