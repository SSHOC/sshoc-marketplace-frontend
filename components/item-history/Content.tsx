import css from "@/components/item-form/Content.module.css";

import type { ReactNode } from "react";

export interface ContentProps {
	children?: ReactNode;
}

export function Content(props: ContentProps): ReactNode {
	const { children } = props;

	return <div className={css["content"]}>{children}</div>;
}
