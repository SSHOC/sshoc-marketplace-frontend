import type { ReactNode } from "react";

import css from "@/components/auth/SignUpScreenLayout.module.css";

export interface SignUpScreenLayoutProps {
	children?: ReactNode;
}

export function SignUpScreenLayout(props: SignUpScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
