import css from "@/lib/core/ui/Centered/Centered.module.css";

import type { ElementType, ReactNode } from "react";

export interface CenteredProps {
	elementType?: ElementType;
	children?: ReactNode;
}

export function Centered(props: CenteredProps): ReactNode {
	const ElementType = props.elementType ?? "div";

	return <ElementType className={css["container"]}>{props.children}</ElementType>;
}
