import css from "@/components/account/AccountScreenWithFiltersLayout.module.css";

import type { ReactNode } from "react";

export interface AccountScreenWithFiltersLayoutProps {
	children?: ReactNode;
}

export function AccountScreenWithFiltersLayout(
	props: AccountScreenWithFiltersLayoutProps,
): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
