import type { ReactNode } from "react";

import css from "@/components/item/ItemInfo.module.css";

export interface ItemInfoProps {
	children?: ReactNode;
}

export function ItemInfo(props: ItemInfoProps): ReactNode {
	return <aside className={css["container"]}>{props.children}</aside>;
}
