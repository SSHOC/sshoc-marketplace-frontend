import css from "@/components/account/AccountScreenWithoutFiltersLayout.module.css";

import type { ReactNode } from "react";

export interface AccountScreenWithoutFiltersLayoutProps {
	children?: ReactNode;
}

export function AccountScreenWithoutFiltersLayout(
	props: AccountScreenWithoutFiltersLayoutProps,
): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
