import type { ReactNode } from "react";

import css from "@/components/common/ScreenTitle.module.css";

export interface ScreenTitleProps {
	children?: ReactNode;
}

export function ScreenTitle(props: ScreenTitleProps): JSX.Element {
	return <h1 className={css["heading"]}>{props.children}</h1>;
}
