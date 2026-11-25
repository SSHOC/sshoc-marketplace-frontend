import css from "@/components/common/Prose.module.css";

import type { ReactNode } from "react";

export interface ProseProps {
	children?: ReactNode;
}

export function Prose(props: ProseProps): ReactNode {
	return <div className={css["container"]}>{props.children}</div>;
}
