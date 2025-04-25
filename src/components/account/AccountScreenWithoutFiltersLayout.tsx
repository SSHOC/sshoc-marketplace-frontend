import type { ReactNode } from "react";

import css from "@/components/account/AccountScreenWithoutFiltersLayout.module.css";

export interface AccountScreenWithoutFiltersLayoutProps {
	children?: ReactNode;
}

export function AccountScreenWithoutFiltersLayout(
	props: AccountScreenWithoutFiltersLayoutProps,
): JSX.Element {
	return <div className={css["layout"]}>{props.children}</div>;
}
