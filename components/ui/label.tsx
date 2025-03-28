"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import { Label as AriaLabel, type LabelProps as AriaLabelProps } from "react-aria-components";

import { useFieldStatus } from "@/components/ui/field-status-context";
import { RequiredIndicator } from "@/components/ui/required-indicator";

interface LabelProps extends AriaLabelProps {}

export function Label(props: Readonly<LabelProps>): ReactNode {
	const { children, className, ...rest } = props;

	const status = useFieldStatus();

	return (
		<AriaLabel
			{...rest}
			className={cn(
				"inline-flex cursor-default gap-x-1 text-sm text-neutral-800 group-disabled:text-neutral-300",
				className,
			)}
			data-slot="label"
		>
			{children}
			{status?.isRequired ? <RequiredIndicator /> : null}
		</AriaLabel>
	);
}
