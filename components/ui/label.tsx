"use client";

import { type GetVariantProps, styles } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import { Label as AriaLabel, type LabelProps as AriaLabelProps } from "react-aria-components";

import { useFieldStatus } from "@/components/ui/field-status-context";
import { RequiredIndicator } from "@/components/ui/required-indicator";

const labelStyles = styles({
	base: "inline-flex cursor-default gap-x-1 text-neutral-800 group-disabled:text-neutral-300",
	variants: {
		kind: {
			default: "text-sm",
			group: "text-base",
		},
	},
	defaults: {
		kind: "default",
	},
});

type LabelStyles = GetVariantProps<typeof labelStyles>;

interface LabelProps extends AriaLabelProps, LabelStyles {}

export function Label(props: Readonly<LabelProps>): ReactNode {
	const { children, className, kind, ...rest } = props;

	const status = useFieldStatus();

	return (
		<AriaLabel {...rest} className={labelStyles({ className, kind })} data-slot="label">
			{children}
			{status?.isRequired ? <RequiredIndicator /> : null}
		</AriaLabel>
	);
}
