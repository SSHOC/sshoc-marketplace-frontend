import css from "@/components/item/ItemHeader.module.css";

import type { ReactNode } from "react";

export interface ItemHeaderProps {
	children?: ReactNode;
}

export function ItemHeader(props: ItemHeaderProps): ReactNode {
	return <header className={css["container"]}>{props.children}</header>;
}
