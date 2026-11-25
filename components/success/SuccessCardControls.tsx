import css from "@/components/success/SuccessCardControls.module.css";

import type { ReactNode } from "react";

export interface SuccessCardControlsProps {
	children?: ReactNode;
}

export function SuccessCardControls(props: SuccessCardControlsProps): ReactNode {
	const { children } = props;

	return <div className={css["container"]}>{children}</div>;
}
