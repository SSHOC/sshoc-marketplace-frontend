"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { type ReactNode } from "react";
import {
	FieldError as AriaFieldError,
	composeRenderProps,
	type FieldErrorProps as AriaFieldErrorProps,
} from "react-aria-components";

interface FieldErrorProps extends AriaFieldErrorProps {}

export function FieldError(props: Readonly<FieldErrorProps>): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<AriaFieldError
			{...rest}
			className={composeRenderProps(className, (className) => {
				return cn(
					"inline-flex gap-x-2 py-1 text-sm leading-6 text-negative-600 forced-colors:text-[Mark]",
					className,
				);
			})}
			data-slot="error"
		>
			{children}
		</AriaFieldError>
	);
}
