import type { ReactNode } from "react";

import css from "@/components/contact/ContactScreenLayout.module.css";

export interface ContactScreenLayoutProps {
	children?: ReactNode;
}

export function ContactScreenLayout(props: ContactScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
