import css from "@/components/common/FormFieldList.module.css";

import type { ReactNode } from "react";

export interface FormFieldListProps {
	children?: ReactNode;
	/** @default 'primary' */
	variant?: "primary" | "thumbnails";
}

export function FormFieldList(props: FormFieldListProps): ReactNode {
	const { children, variant = "primary" } = props;

	return (
		<ol role="list" className={css["list"]} data-variant={variant}>
			{children}
		</ol>
	);
}
