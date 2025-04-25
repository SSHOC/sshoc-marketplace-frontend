import type { ReactNode } from "react";

import css from "@/components/about/AboutScreenLayout.module.css";

export interface AboutScreenLayoutProps {
	children?: ReactNode;
}

export function AboutScreenLayout(props: AboutScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
