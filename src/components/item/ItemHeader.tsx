import type { ReactNode } from "react";

import css from "@/components/item/ItemHeader.module.css";

export interface ItemHeaderProps {
	children?: ReactNode;
}

export function ItemHeader(props: ItemHeaderProps): ReactNode {
	return <header className={css["container"]}>{props.children}</header>;
}
