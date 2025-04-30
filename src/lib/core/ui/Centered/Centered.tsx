import type { ElementType, ReactNode } from "react";

import css from "@/lib/core/ui/Centered/Centered.module.css";

export interface CenteredProps {
	elementType?: ElementType;
	children?: ReactNode;
}

export function Centered(props: CenteredProps): ReactNode {
	const ElementType = props.elementType ?? "div";

	return <ElementType className={css["container"]}>{props.children}</ElementType>;
}
