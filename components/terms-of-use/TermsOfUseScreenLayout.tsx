import css from "@/components/terms-of-use/TermsOfUseScreenLayout.module.css";

import type { ReactNode } from "react";

export interface TermsOfUseScreenLayoutProps {
	children?: ReactNode;
}

export function TermsOfUseScreenLayout(props: TermsOfUseScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
