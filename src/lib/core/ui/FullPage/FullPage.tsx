import type { ReactNode } from "react";

import css from "@/lib/core/ui/FullPage/FullPage.module.css";

export interface FullPageProps {
	children?: ReactNode;
}

export function FullPage(props: FullPageProps): JSX.Element {
	return (
		<main id="main" tabIndex={-1} className={css["container"]}>
			{props.children}
		</main>
	);
}
