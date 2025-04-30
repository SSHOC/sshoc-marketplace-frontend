import type { ReactNode } from "react";

import css from "@/components/common/FormSections.module.css";

export interface FormSectionsProps {
	children?: ReactNode;
}

export function FormSections(props: FormSectionsProps): ReactNode {
	const { children } = props;

	return <div className={css["sections"]}>{children}</div>;
}
