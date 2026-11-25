import css from "@/components/success/SuccessCard.module.css";

import type { ReactNode } from "react";

import { Card } from "@/components/common/Card";

export interface SuccessCardProps {
	children?: ReactNode;
}

export function SuccessCard(props: SuccessCardProps): ReactNode {
	return (
		<div className={css["container"]}>
			<Card>{props.children}</Card>
		</div>
	);
}
