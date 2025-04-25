import type { ReactNode } from "react";

import css from "@/components/common/FormControls.module.css";

export interface FormControlsProps {
	children?: ReactNode;
}

export function FormControls(props: FormControlsProps): ReactNode {
	const { children } = props;

	return <div className={css["controls"]}>{children}</div>;
}
