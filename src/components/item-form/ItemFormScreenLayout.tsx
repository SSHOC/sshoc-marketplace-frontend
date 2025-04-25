import type { ReactNode } from "react";

import css from "@/components/item-form/ItemFormScreenLayout.module.css";

export interface ItemFormScreenLayoutProps {
	children?: ReactNode;
}

export function ItemFormScreenLayout(props: ItemFormScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
