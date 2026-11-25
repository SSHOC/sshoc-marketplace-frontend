import css from "@/components/common/FormControls.module.css";

import type { ReactNode } from "react";

export interface FormControlsProps {
	children?: ReactNode;
}

export function FormControls(props: FormControlsProps): ReactNode {
	const { children } = props;

	return <div className={css["controls"]}>{children}</div>;
}
