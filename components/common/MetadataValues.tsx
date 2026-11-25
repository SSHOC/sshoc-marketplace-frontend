import css from "@/components/common/MetadataValues.module.css";

import type { ReactNode } from "react";

export interface MetadataValuesProps {
	children?: ReactNode;
}

export function MetadataValues(props: MetadataValuesProps): ReactNode {
	const { children } = props;

	return <div className={css["container"]}>{children}</div>;
}
