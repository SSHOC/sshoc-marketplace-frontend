import css from "@/components/account/AccountScreenLayout.module.css";

import type { ReactNode } from "react";

export interface AccountScreenLayoutProps {
	children?: ReactNode;
}

export function AccountScreenLayout(props: AccountScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
