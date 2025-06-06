import type { ReactNode } from "react";

import css from "@/components/common/Prose.module.css";

export interface ProseProps {
	children?: ReactNode;
}

export function Prose(props: ProseProps): ReactNode {
	return <div className={css["container"]}>{props.children}</div>;
}
