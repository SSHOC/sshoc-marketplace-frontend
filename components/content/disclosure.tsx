import type { ReactNode } from "react";

interface DisclosureProps {
	children?: ReactNode;
	title: string;
}

export function Disclosure(props: Readonly<DisclosureProps>): ReactNode {
	const { children, title } = props;

	return (
		<details className="flex flex-col gap-y-1">
			<summary>{title}</summary>
			<div>{children}</div>
		</details>
	);
}
