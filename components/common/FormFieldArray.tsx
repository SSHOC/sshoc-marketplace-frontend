import css from "@/components/common/FormFieldArray.module.css";

import type { ReactNode } from "react";

export interface FormFieldArrayProps {
	children?: ReactNode;
}

export function FormFieldArray(props: FormFieldArrayProps): ReactNode {
	const { children } = props;

	return <div className={css["container"]}>{children}</div>;
}
