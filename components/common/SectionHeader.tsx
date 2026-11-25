import css from "@/components/common/SectionHeader.module.css";

import type { ReactNode } from "react";

export interface SectionHeaderProps {
	children?: ReactNode;
}

export function SectionHeader(props: SectionHeaderProps): ReactNode {
	return <div className={css["container"]}>{props.children}</div>;
}
