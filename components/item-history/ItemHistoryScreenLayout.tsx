import css from "@/components/item-history/ItemHistoryScreenLayout.module.css";

import type { ReactNode } from "react";

export interface ItemHistoryScreenLayoutProps {
	children?: ReactNode;
}

export function ItemHistoryScreenLayout(props: ItemHistoryScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
