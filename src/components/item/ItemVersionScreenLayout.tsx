import type { ReactNode } from "react";

import css from "@/components/item/ItemVersionScreenLayout.module.css";

export interface ItemVersionScreenLayoutProps {
	children?: ReactNode;
}

export function ItemVersionScreenLayout(props: ItemVersionScreenLayoutProps): JSX.Element {
	return <div className={css["layout"]}>{props.children}</div>;
}
