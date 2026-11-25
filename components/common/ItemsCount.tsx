import css from "@/components/common/ItemsCount.module.css";

import type { ReactNode } from "react";

export interface ItemsCountProps {
	count: number;
}

export function ItemsCount(props: ItemsCountProps): ReactNode {
	return <span className={css["text"]}>({props.count})</span>;
}
