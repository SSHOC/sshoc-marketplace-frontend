import css from "@/lib/core/ui/Overlay/Underlay.module.css";

import type { HTMLAttributes, ReactNode } from "react";

export interface UnderlayProps extends HTMLAttributes<HTMLDivElement> {
	isOpen?: boolean;
}

export function Underlay(props: UnderlayProps): ReactNode {
	const { isOpen, ...domProps } = props;

	return <div {...domProps} className={css["underlay"]} data-open={isOpen} />;
}
