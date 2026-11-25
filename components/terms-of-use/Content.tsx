import css from "@/components/terms-of-use/Content.module.css";

import type { ReactNode } from "react";

export interface ContentProps {
	children?: ReactNode;
}

export function Content(props: ContentProps): ReactNode {
	return <div className={css["container"]}>{props.children}</div>;
}
