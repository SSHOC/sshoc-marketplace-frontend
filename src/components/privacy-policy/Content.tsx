import type { ReactNode } from "react";

import css from "@/components/privacy-policy/Content.module.css";

export interface ContentProps {
	children?: ReactNode;
}

export function Content(props: ContentProps): JSX.Element {
	return <div className={css["container"]}>{props.children}</div>;
}
