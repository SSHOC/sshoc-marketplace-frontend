"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { ChevronDownIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	composeRenderProps,
	Select as AriaSelect,
	type SelectProps as AriaSelectProps,
	SelectValue as AriaSelectValue,
	type SelectValueProps as AriaSelectValueProps,
} from "react-aria-components";

import { FieldStatusContext } from "@/components/ui/field-status-context";

interface SelectProps<T extends object> extends AriaSelectProps<T> {}

export function Select<T extends object>(props: Readonly<SelectProps<T>>): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<AriaSelect
			{...rest}
			className={cn("group grid content-start gap-y-1", className)}
			data-slot="field"
		>
			{composeRenderProps(children, (children, renderProps) => {
				return <FieldStatusContext value={renderProps}>{children}</FieldStatusContext>;
			})}
		</AriaSelect>
	);
}

interface SelectTriggerProps extends AriaButtonProps {}

export function SelectTrigger(props: Readonly<SelectTriggerProps>): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<AriaButton
			{...rest}
			className={composeRenderProps(className, (className) => {
				return cn(
					"relative isolate inline-flex min-h-12 items-center gap-x-2 rounded-sm border border-neutral-250 bg-neutral-0 pr-12 pl-4 text-left text-base whitespace-nowrap transition group-invalid:border-2 group-invalid:border-negative-600 group-invalid:bg-negative-100 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-brand-600 disabled:border-neutral-200 forced-colors:group-invalid:border-[Mark] forced-colors:disabled:border-[GrayText] forced-colors:disabled:text-[GrayText]",
					className,
				);
			})}
			data-slot="control"
		>
			{composeRenderProps(children, (children) => {
				return (
					<Fragment>
						{children}
						<ChevronDownIcon
							aria-hidden={true}
							className="absolute top-0 right-4 size-4 h-full shrink-0 text-neutral-700 transition group-open:rotate-180 group-invalid:text-negative-600 group-disabled:text-neutral-300 forced-colors:text-[ButtonText] forced-colors:group-disabled:text-[GrayText]"
							data-slot="icon"
						/>
					</Fragment>
				);
			})}
		</AriaButton>
	);
}

interface SelectValueProps<T extends object> extends AriaSelectValueProps<T> {}

export function SelectValue<T extends object>(props: Readonly<SelectValueProps<T>>): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<AriaSelectValue
			{...rest}
			className={composeRenderProps(className, (className) => {
				return cn(
					"text-small text-text-strong group-disabled:text-text-disabled placeholder-shown:text-text-weak placeholder-shown:italic",
					className,
				);
			})}
		>
			{children}
		</AriaSelectValue>
	);
}
