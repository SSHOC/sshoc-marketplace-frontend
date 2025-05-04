import type { ReactNode } from "react";

import { Link } from "@/components/common/Link";

export interface SkipLinkProps {
	children?: ReactNode;
}

export function SkipLink(props: SkipLinkProps): ReactNode {
	const id = "main-content";

	function moveFocus() {
		/**
		 * Fragment identifier links do not move focus to the target in Firefox.
		 */
		document.getElementById(id)?.focus();
	}

	return (
		<Link href={"#" + id} onClick={moveFocus} variant="skip-link">
			{props.children}
		</Link>
	);
}
