"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import {
	composeRenderProps,
	Input as AriaInput,
	type InputProps as AriaInputProps,
} from "react-aria-components";

interface InputProps extends AriaInputProps {}

export function Input(props: Readonly<InputProps>): ReactNode {
	const { className, ...rest } = props;

	return (
		<AriaInput
			{...rest}
			className={composeRenderProps(className, (className) => {
				return cn(
					"min-h-12 rounded-sm border border-neutral-250 bg-neutral-50 px-4 text-[0.9375rem] text-neutral-800 transition placeholder:text-neutral-400 invalid:border-2 invalid:border-negative-600 invalid:bg-negative-100 hover:border-brand-600 hover:bg-neutral-0 focus-visible:border-brand-600 focus-visible:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:border-neutral-100 disabled:text-neutral-500 forced-colors:border-[ButtonBorder] forced-colors:invalid:border-[Mark] forced-colors:focus:border-[Highlight] forced-colors:disabled:border-[GrayText]",
					className,
				);
			})}
			data-slot="control"
		/>
	);
}
