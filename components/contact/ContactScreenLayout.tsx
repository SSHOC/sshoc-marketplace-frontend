import css from "@/components/contact/ContactScreenLayout.module.css";

import type { ReactNode } from "react";

export interface ContactScreenLayoutProps {
	children?: ReactNode;
}

export function ContactScreenLayout(props: ContactScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
