import "@/styles/tailwind.css";

import type { ReactNode } from "react";

interface CmsLayoutProps {
	children: ReactNode;
}

export default function CmsLayout(props: Readonly<CmsLayoutProps>): ReactNode {
	const { children } = props;

	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
