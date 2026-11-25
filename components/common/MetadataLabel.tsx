import css from "@/components/common/MetadataLabel.module.css";

import type { ReactNode } from "react";

export interface MetadataLabelProps {
	children?: ReactNode;
	/** @default 'md' */
	size?: "md" | "sm" | "xs";
}

export function MetadataLabel(props: MetadataLabelProps): ReactNode {
	const { children, size = "md" } = props;

	return (
		<span className={css["text"]} data-size={size}>
			{children}
		</span>
	);
}
