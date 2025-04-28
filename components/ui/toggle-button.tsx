"use client";

import { type GetVariantProps, styles } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import {
	composeRenderProps,
	ToggleButton as AriaToggleButton,
	type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components";

const toggleButtonStyles = styles({
	base: "relative isolate inline-flex items-center justify-center gap-x-2 border border-neutral-250 bg-neutral-50 text-center outline-transparent transition hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed forced-colors:disabled:text-[GrayText] selected:bg-brand-300 slot-icon:shrink-0",
	variants: {
		size: {
			small: "rounded-sm text-sm font-medium",
			medium: "rounded-sm text-base font-medium",
		},
		variant: {
			default: "slot-icon:first-child:-ml-1 slot-icon:last-child:-mr-1",
			"icon-only": "",
		},
	},
	combinations: [
		[{ size: "small", variant: "default" }, "min-h-8 px-3 py-1 slot-icon:size-4"],
		[{ size: "medium", variant: "default" }, "min-h-12 px-10 py-2.5 slot-icon:size-5"],

		[{ size: "small", variant: "icon-only" }, "size-8 slot-icon:size-4"],
		[{ size: "medium", variant: "icon-only" }, "size-12 slot-icon:size-6"],
	],
	defaults: {
		size: "medium",
		variant: "default",
	},
});

type ToggleButtonStyleProps = GetVariantProps<typeof toggleButtonStyles>;

interface ToggleButtonProps extends AriaToggleButtonProps, ToggleButtonStyleProps {}

export function ToggleButton(props: Readonly<ToggleButtonProps>): ReactNode {
	const { children, className, size, variant, ...rest } = props;

	return (
		<AriaToggleButton
			{...rest}
			className={composeRenderProps(className, (className) => {
				return toggleButtonStyles({ className, size, variant });
			})}
		>
			{children}
		</AriaToggleButton>
	);
}
