import css from "@/components/item/ItemScreenLayout.module.css";

import type { ReactNode } from "react";

export interface ItemScreenLayoutProps {
	children?: ReactNode;
}

export function ItemScreenLayout(props: ItemScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
