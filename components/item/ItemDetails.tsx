import type { ReactNode } from "react";

import css from "@/components/item/ItemDetails.module.css";

export interface ItemDetailsProps {
	children?: ReactNode;
}
export function ItemDetails(props: ItemDetailsProps): ReactNode {
	return <div className={css["container"]}>{props.children}</div>;
}
