import type { ReactNode } from "react";

import css from "@/components/item/ItemScreenLayout.module.css";

export interface ItemScreenLayoutProps {
	children?: ReactNode;
}

export function ItemScreenLayout(props: ItemScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
