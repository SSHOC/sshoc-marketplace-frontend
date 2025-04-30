import type { ReactNode } from "react";

import css from "@/components/common/FormFieldListItemControls.module.css";

export interface FormFieldListItemControlsProps {
	children?: ReactNode;
}

export function FormFieldListItemControls(props: FormFieldListItemControlsProps): ReactNode {
	const { children } = props;

	return <div className={css["container"]}>{children}</div>;
}
