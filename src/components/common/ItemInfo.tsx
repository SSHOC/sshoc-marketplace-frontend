import type { ReactNode } from "react";

import css from "@/components/common/ItemInfo.module.css";

export interface ItemInfoProps {
	children?: ReactNode;
}

export function ItemInfo(props: ItemInfoProps): JSX.Element {
	const { children } = props;

	return <span className={css["text"]}>{children}</span>;
}
