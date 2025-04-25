import type { ReactNode } from "react";

import css from "@/components/success/SuccessCardControls.module.css";

export interface SuccessCardControlsProps {
	children?: ReactNode;
}

export function SuccessCardControls(props: SuccessCardControlsProps): JSX.Element {
	const { children } = props;

	return <div className={css["container"]}>{children}</div>;
}
