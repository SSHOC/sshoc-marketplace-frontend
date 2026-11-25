import css from "@/components/common/ItemInfo.module.css";

import type { ReactNode } from "react";

export interface ItemInfoProps {
	children?: ReactNode;
}

export function ItemInfo(props: ItemInfoProps): ReactNode {
	const { children } = props;

	return <span className={css["text"]}>{children}</span>;
}
