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
	base: "group text-text-strong disabled:text-text-disabled inline-flex items-center gap-x-3 forced-colors:disabled:text-[GrayText]",
	variants: {
		size: {
			small: "text-tiny",
			large: "text-small",
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
	base: "interactive rounded-1 border-stroke-strong bg-fill-inverse-strong text-fill-inverse-strong group-invalid:border-stroke-error-strong group-invalid:bg-fill-error-weak group-hover:hover-overlay group-focus-visible:focus-outline group-disabled:border-stroke-disabled group-pressed:press-overlay group-selected:bg-fill-brand-strong group-selected:group-invalid:bg-fill-error-strong group-selected:group-disabled:bg-fill-disabled isolate inline-grid shrink-0 place-content-center border transition group-selected:border-transparent forced-colors:group-invalid:text-[Mark] forced-colors:group-disabled:text-[GrayText] forced-colors:group-selected:text-[Highlight]",
	variants: {
		size: {
			small: "size-6 rounded-[3px] p-1.5",
			large: "rounded-1 size-8 p-2",
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
					className="group-disabled:text-text-disabled shrink-0 forced-colors:text-[HighlightText]"
					data-slot="icon"
				/>
			) : isSelected ? (
				<CheckIcon
					aria-hidden={true}
					className="group-disabled:text-text-disabled shrink-0 forced-colors:text-[HighlightText]"
					data-slot="icon"
				/>
			) : null}
		</div>
	);
}
