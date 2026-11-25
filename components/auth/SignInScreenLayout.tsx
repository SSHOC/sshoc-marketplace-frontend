import css from "@/components/auth/SignInScreenLayout.module.css";

import type { ReactNode } from "react";

export interface SignInScreenLayoutProps {
	children?: ReactNode;
}

export function SignInScreenLayout(props: SignInScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
