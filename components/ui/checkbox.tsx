"use client";

import { type GetVariantProps, styles } from "@acdh-oeaw/style-variants";
import { CheckIcon, MinusIcon } from "lucide-react";
import { type ComponentPropsWithRef, Fragment, type ReactNode } from "react";
import {
	Checkbox as AriaCheckBox,
	type CheckboxProps as AriaCheckBoxProps,
	type CheckboxRenderProps as AriaCheckboxRenderProps,
	composeRenderProps,
} from "react-aria-components";

const checkBoxStyles = styles({
	base: "group inline-flex items-center gap-x-3 text-neutral-800 disabled:text-neutral-300 forced-colors:disabled:text-[GrayText]",
	variants: {
		size: {
			small: "text-base",
			large: "text-base",
		},
	},
	defaults: {
		size: "large",
	},
});

type CheckBoxStyleProps = GetVariantProps<typeof checkBoxStyles>;

interface CheckBoxProps extends AriaCheckBoxProps, CheckBoxStyleProps {}

export function CheckBox(props: Readonly<CheckBoxProps>): ReactNode {
	const { children, className, size, ...rest } = props;

	return (
		<AriaCheckBox
			{...rest}
			className={composeRenderProps(className, (className) => {
				return checkBoxStyles({ className, size });
			})}
			data-slot="field"
		>
			{composeRenderProps(children, (children, renderProps) => {
				const { isIndeterminate, isSelected } = renderProps;

				return (
					<Fragment>
						<CheckBoxBox isIndeterminate={isIndeterminate} isSelected={isSelected} size={size} />
						<span data-slot="label">{children}</span>
					</Fragment>
				);
			})}
		</AriaCheckBox>
	);
}

const checkBoxBoxStyles = styles({
	base: "relative isolate inline-grid shrink-0 place-content-center rounded-sm border border-neutral-250 bg-neutral-50 text-neutral-0 transition group-invalid:border-negative-600 group-invalid:bg-negative-100 group-focus-visible:outline-2 group-focus-visible:outline-brand-600 group-disabled:border-neutral-200 group-selected:border-transparent group-selected:bg-brand-600 group-selected:group-invalid:bg-negative-100 group-selected:group-disabled:bg-neutral-200 forced-colors:group-invalid:text-[Mark] forced-colors:group-disabled:text-[GrayText] forced-colors:group-selected:text-[Highlight]",
	variants: {
		size: {
			small: "size-3.5 rounded-[3px] *:data-[slot=icon]:size-3",
			large: "size-6 rounded-sm *:data-[slot=icon]:size-5",
		},
	},
	defaults: {
		size: "large",
	},
});

type CheckBoxBoxStyles = GetVariantProps<typeof checkBoxBoxStyles>;

interface CheckBoxBoxProps
	extends ComponentPropsWithRef<"div">,
		Pick<AriaCheckboxRenderProps, "isIndeterminate" | "isSelected">,
		CheckBoxBoxStyles {}

export function CheckBoxBox(props: Readonly<CheckBoxBoxProps>): ReactNode {
	const { className, isIndeterminate, isSelected, size, ...rest } = props;

	return (
		<div {...rest} className={checkBoxBoxStyles({ className, size })} data-slot="control">
			{isIndeterminate ? (
				<MinusIcon
					aria-hidden={true}
					className="shrink-0 stroke-3 group-disabled:text-neutral-200 forced-colors:text-[HighlightText]"
					data-slot="icon"
				/>
			) : isSelected ? (
				<CheckIcon
					aria-hidden={true}
					className="shrink-0 stroke-3 group-disabled:text-neutral-200 forced-colors:text-[HighlightText]"
					data-slot="icon"
				/>
			) : null}
		</div>
	);
}
