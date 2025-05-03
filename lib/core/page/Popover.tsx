import type { ReactNode } from "react";
import { Popover as AriaPopover } from "react-aria-components";

import css from "@/lib/core/page/Popover.module.css";

export interface PopoverProps {
	children: ReactNode;
}

export function Popover(props: PopoverProps) {
	const { children } = props;

	return <AriaPopover className={css["container"]}>{children}</AriaPopover>;
}
