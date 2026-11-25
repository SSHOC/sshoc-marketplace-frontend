import css from "@/components/common/FormFieldArrayControls.module.css";

import type { ReactNode } from "react";

export interface FormFieldArrayControlsProps {
	children?: ReactNode;
}

export function FormFieldArrayControls(props: FormFieldArrayControlsProps): ReactNode {
	const { children } = props;

	return <div className={css["container"]}>{children}</div>;
}
