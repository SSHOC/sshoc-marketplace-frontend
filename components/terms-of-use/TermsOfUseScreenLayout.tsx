import type { ReactNode } from "react";

import css from "@/components/terms-of-use/TermsOfUseScreenLayout.module.css";

export interface TermsOfUseScreenLayoutProps {
	children?: ReactNode;
}

export function TermsOfUseScreenLayout(props: TermsOfUseScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
