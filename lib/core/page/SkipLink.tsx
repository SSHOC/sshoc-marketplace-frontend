import Link from "next/link";
import type { ReactNode } from "react";

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
		<Link
			href={"#" + id}
			className="absolute z-10 m-2 translate-y-[-125%] rounded-sm bg-neutral-0 p-4 text-primary-700 shadow focus-visible:translate-y-0"
			onClick={moveFocus}
		>
			{props.children}
		</Link>
	);
}
