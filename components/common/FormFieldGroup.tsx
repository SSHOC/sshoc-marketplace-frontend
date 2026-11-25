import css from "@/components/common/FormFieldGroup.module.css";

import type { ReactNode } from "react";

export interface FormFieldGroupProps {
	children?: ReactNode;
}

export function FormFieldGroup(props: FormFieldGroupProps): ReactNode {
	const { children } = props;

	return (
		<div role="group" className={css["container"]}>
			{children}
		</div>
	);
}
