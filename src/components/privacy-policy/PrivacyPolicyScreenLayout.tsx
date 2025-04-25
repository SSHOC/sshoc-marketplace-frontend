import type { ReactNode } from "react";

import css from "@/components/privacy-policy/PrivacyPolicyScreenLayout.module.css";

export interface PrivacyPolicyScreenLayoutProps {
	children?: ReactNode;
}

export function PrivacyPolicyScreenLayout(props: PrivacyPolicyScreenLayoutProps): ReactNode {
	return <div className={css["layout"]}>{props.children}</div>;
}
