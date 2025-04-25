import type { ReactNode } from "react";

import css from "@/components/common/MetadataValues.module.css";

export interface MetadataValuesProps {
	children?: ReactNode;
}

export function MetadataValues(props: MetadataValuesProps): JSX.Element {
	const { children } = props;

	return <div className={css["container"]}>{children}</div>;
}
