import type { ReactNode } from "react";

import css from "@/components/home/SubSectionHeader.module.css";

export interface SectionHeaderProps {
	children?: ReactNode;
}

export function SectionHeader(props: SectionHeaderProps): ReactNode {
	return <div className={css["container"]}>{props.children}</div>;
}
