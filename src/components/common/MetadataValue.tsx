import type { ReactNode } from "react";

import css from "@/components/common/MetadataValue.module.css";

export interface MetadataValueProps {
	children?: ReactNode;
	/** @default 'md' */
	size?: "md" | "sm" | "xs";
}

export function MetadataValue(props: MetadataValueProps): ReactNode {
	const { children, size = "md" } = props;

	return (
		<span className={css["text"]} data-size={size}>
			{children}
		</span>
	);
}
