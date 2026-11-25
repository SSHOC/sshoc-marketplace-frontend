import css from "@/components/common/FormFieldListItem.module.css";

import type { ReactNode } from "react";

export interface FormFieldListItemProps {
	children?: ReactNode;
}

export function FormFieldListItem(props: FormFieldListItemProps): ReactNode {
	const { children } = props;

	return <li className={css["list-item"]}>{children}</li>;
}
