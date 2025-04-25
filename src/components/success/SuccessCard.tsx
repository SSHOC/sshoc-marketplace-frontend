import type { ReactNode } from "react";

import { Card } from "@/components/common/Card";
import css from "@/components/success/SuccessCard.module.css";

export interface SuccessCardProps {
	children?: ReactNode;
}

export function SuccessCard(props: SuccessCardProps): JSX.Element {
	return (
		<div className={css["container"]}>
			<Card>{props.children}</Card>
		</div>
	);
}
