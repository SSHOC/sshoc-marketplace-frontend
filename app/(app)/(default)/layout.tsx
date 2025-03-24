import type { ReactNode } from "react";

import { PageFooter } from "@/app/(app)/(default)/_components/page-footer";
import { PageHeader } from "@/app/(app)/(default)/_components/page-header";

interface DefaultGroupLayoutProps {
	children: ReactNode;
}

export default function DefaultGroupLayout(props: Readonly<DefaultGroupLayoutProps>): ReactNode {
	const { children } = props;

	return (
		<div className="grid min-h-full grid-rows-[auto_1fr_auto]">
			<PageHeader />
			{children}
			<PageFooter />
		</div>
	);
}
