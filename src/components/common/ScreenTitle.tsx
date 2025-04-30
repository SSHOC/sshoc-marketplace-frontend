import type { ReactNode } from "react";

import css from "@/components/common/ScreenTitle.module.css";

export interface ScreenTitleProps {
	children?: ReactNode;
}

export function ScreenTitle(props: ScreenTitleProps): ReactNode {
	return <h1 className={css["heading"]}>{props.children}</h1>;
}
