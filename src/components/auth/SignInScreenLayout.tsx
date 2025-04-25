import type { ReactNode } from "react";

import css from "@/components/auth/SignInScreenLayout.module.css";

export interface SignInScreenLayoutProps {
	children?: ReactNode;
}

export function SignInScreenLayout(props: SignInScreenLayoutProps): JSX.Element {
	return <div className={css["layout"]}>{props.children}</div>;
}
