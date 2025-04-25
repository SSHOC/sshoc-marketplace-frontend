import type { ReactNode } from "react";

import css from "@/components/account/AccountScreenWithFiltersLayout.module.css";

export interface AccountScreenWithFiltersLayoutProps {
	children?: ReactNode;
}

export function AccountScreenWithFiltersLayout(
	props: AccountScreenWithFiltersLayoutProps,
): JSX.Element {
	return <div className={css["layout"]}>{props.children}</div>;
}
