import type { ReactNode } from "react";

import css from "@/components/account/AccountScreenLayout.module.css";

export interface AccountScreenLayoutProps {
	children?: ReactNode;
}

export function AccountScreenLayout(props: AccountScreenLayoutProps): JSX.Element {
	return <div className={css["layout"]}>{props.children}</div>;
}
