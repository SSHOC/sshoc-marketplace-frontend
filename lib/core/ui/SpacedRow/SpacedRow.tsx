import css from "@/lib/core/ui/SpacedRow/SpacedRow.module.css";

import type { CSSProperties, ReactNode } from "react";

export interface SpacedRowStyleProps {
	"--spaced-row-gap"?: CSSProperties["gap"];
}

export interface SpacedRowProps {
	children?: ReactNode;
	style?: SpacedRowStyleProps;
}

export function SpacedRow(props: SpacedRowProps): ReactNode {
	const { children, style } = props;

	return (
		<div className={css["container"]} style={style as CSSProperties}>
			{children}
		</div>
	);
}
