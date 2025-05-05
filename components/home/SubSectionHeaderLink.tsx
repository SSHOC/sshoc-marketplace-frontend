import type { ReactNode } from "react";

import type { LinkProps } from "@/components/common/Link";
import { Link } from "@/components/common/Link";

export function SubSectionHeaderLink(props: LinkProps): ReactNode {
	return (
		<span className="text-md">
			<Link {...props} />
		</span>
	);
}
