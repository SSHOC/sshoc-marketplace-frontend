import css from "@/components/item/ItemVersionScreenLayout.module.css";

import type { ReactNode } from "react";

export interface ItemVersionScreenLayoutProps {
	children?: ReactNode;
}

export function ItemVersionScreenLayout(props: ItemVersionScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
