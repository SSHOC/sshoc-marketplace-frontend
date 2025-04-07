"use client";

import { type GetVariantProps, styles } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import {
	composeRenderProps,
	Input as AriaInput,
	type InputProps as AriaInputProps,
} from "react-aria-components";

const inputStyles = styles({
	base: "rounded-sm border border-neutral-250 px-4 text-base text-neutral-800 transition placeholder:text-neutral-400 invalid:border-negative-600 invalid:bg-negative-100 hover:invalid:border-negative-600 focus:border-brand-600 focus:outline-2 focus:outline-brand-600 focus:invalid:border-negative-600 focus:invalid:bg-negative-100 focus:invalid:outline-negative-600 disabled:cursor-not-allowed disabled:border-neutral-100 disabled:text-neutral-500 forced-colors:border-[ButtonBorder] forced-colors:invalid:border-[Mark] forced-colors:focus:border-[Highlight] forced-colors:disabled:border-[GrayText]",
	variants: {
		kind: {
			default: "bg-neutral-50 hover:border-brand-600 hover:bg-neutral-0 focus:bg-brand-50",
			search: "bg-neutral-0 hover:bg-neutral-50 focus:bg-neutral-0",
		},
		size: {
			small: "min-h-9",
			medium: "min-h-12",
		},
	},
	defaults: {
		kind: "default",
		size: "medium",
	},
});

type InputStyleProps = GetVariantProps<typeof inputStyles>;

interface InputProps extends Omit<AriaInputProps, "size">, InputStyleProps {}

export function Input(props: Readonly<InputProps>): ReactNode {
	const { className, kind, size, ...rest } = props;

	return (
		<AriaInput
			{...rest}
			className={composeRenderProps(className, (className) => {
				return inputStyles({ className, kind, size });
			})}
			data-slot="control"
		/>
	);
}
