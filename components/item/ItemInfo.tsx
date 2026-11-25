import css from "@/components/item/ItemInfo.module.css";

import type { ReactNode } from "react";

export interface ItemInfoProps {
	children?: ReactNode;
}

export function ItemInfo(props: ItemInfoProps): ReactNode {
	return <aside className={css["container"]}>{props.children}</aside>;
}
