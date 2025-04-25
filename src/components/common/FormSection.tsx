import type { ReactNode } from "react";

import css from "@/components/common/FormSection.module.css";

export interface FormSectionProps {
	children?: ReactNode;
}

export function FormSection(props: FormSectionProps): JSX.Element {
	const { children } = props;

	return <section className={css["section"]}>{children}</section>;
}
