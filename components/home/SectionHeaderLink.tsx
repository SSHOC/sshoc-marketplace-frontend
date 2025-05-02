import type { ReactNode } from "react";

import type { LinkProps } from "@/components/common/Link";
import { Link } from "@/components/common/Link";
import css from "@/components/home/SectionHeaderLink.module.css";

export function SectionHeaderLink(props: LinkProps): ReactNode {
	return (
		<span className={css["link"]}>
			<Link {...props} />
		</span>
	);
}
