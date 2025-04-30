import type { ReactNode } from "react";

import css from "@/components/common/ItemsCount.module.css";

export interface ItemsCountProps {
	count: number;
}

export function ItemsCount(props: ItemsCountProps): ReactNode {
	return <span className={css["text"]}>({props.count})</span>;
}
