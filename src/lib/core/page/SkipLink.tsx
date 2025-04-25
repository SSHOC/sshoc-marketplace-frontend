import type { ReactNode } from "react";

import { Link } from "@/components/common/Link";
import { usePage } from "@/lib/core/page/PageProvider";

export interface SkipLinkProps {
	children?: ReactNode;
}

export function SkipLink(props: SkipLinkProps): ReactNode {
	const { skipToMainContent } = usePage();

	return (
		<Link {...skipToMainContent.linkProps} variant="skip-link">
			{props.children}
		</Link>
	);
}
