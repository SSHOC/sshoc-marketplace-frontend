import type { ReactNode } from "react";

import css from "@/components/common/FormSections.module.css";

export interface FormSectionsProps {
	children?: ReactNode;
}

export function FormSections(props: FormSectionsProps): JSX.Element {
	const { children } = props;

	return <div className={css["sections"]}>{children}</div>;
}
