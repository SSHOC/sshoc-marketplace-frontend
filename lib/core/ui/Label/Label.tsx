import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import { Label as AriaLabel, type LabelProps as AriaLabelProps } from "react-aria-components";

import { RequiredIndicator } from "@/lib/core/ui/RequiredIndicator/RequiredIndicator";

export interface LabelProps extends AriaLabelProps {
	isRequired?: boolean;
}

export function Label(props: Readonly<LabelProps>): ReactNode {
	const { children, className, isRequired, ...rest } = props;

	return (
		<AriaLabel
			{...rest}
			className={cn(
				"inline-flex cursor-default gap-x-1 text-sm text-neutral-800 transition",
				className,
			)}
		>
			{children}
			{isRequired ? <RequiredIndicator /> : null}
		</AriaLabel>
	);
}
