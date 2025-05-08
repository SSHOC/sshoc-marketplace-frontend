import type { ElementType, ReactNode } from "react";

export interface CenteredProps {
	elementType?: ElementType;
	children?: ReactNode;
}

export function Centered(props: CenteredProps): ReactNode {
	const ElementType = props.elementType ?? "div";

	return (
		<ElementType className="grid place-content-center place-items-center px-16 py-8">
			{props.children}
		</ElementType>
	);
}
