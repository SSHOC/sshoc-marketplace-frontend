import css from "@/components/common/Card.module.css";

import type { ReactNode } from "react";

export interface CardProps {
	children?: ReactNode;
}

export function Card(props: CardProps): ReactNode {
	return <div className={css["container"]}>{props.children}</div>;
}
