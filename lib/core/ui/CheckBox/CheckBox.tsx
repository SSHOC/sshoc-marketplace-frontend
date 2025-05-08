import { cn, type GetVariantProps, styles } from "@acdh-oeaw/style-variants";
import { CheckIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import {
	Checkbox as AriaCheckBox,
	type CheckboxProps as AriaCheckBoxProps,
	composeRenderProps,
} from "react-aria-components";

import { RequiredIndicator } from "@/lib/core/ui/RequiredIndicator/RequiredIndicator";

const checkBoxStyles = styles({
	base: "inline-flex items-center gap-2 py-0.5 disabled:text-neutral-400",
	variants: {
		variant: {
			primary: "",
			facet: "w-full rounded-sm px-2 hover:bg-neutral-50 focus-visible:bg-neutral-50",
		},
	},
	defaults: {
		variant: "primary",
	},
});

type CheckBoxStyleProps = GetVariantProps<typeof checkBoxStyles>;

export interface CheckBoxProps extends AriaCheckBoxProps, CheckBoxStyleProps {}

export function CheckBox(props: Readonly<CheckBoxProps>): ReactNode {
	const { children, className, variant, ...rest } = props;

	return (
		<AriaCheckBox
			{...rest}
			className={composeRenderProps(className, (className) => {
				return checkBoxStyles({ className, variant });
			})}
		>
			{composeRenderProps(children, (children, renderProps) => {
				const { isRequired, isSelected } = renderProps;

				return (
					<Fragment>
						<span
							className={cn(
								"inline-flex size-3.5 shrink-0 items-center justify-center rounded-sm border p-0.5 text-neutral-0",
								isSelected
									? "border-primary-600 bg-primary-600"
									: "border-neutral-250 bg-neutral-50",
							)}
						>
							{isSelected ? <CheckIcon aria-hidden className="" /> : null}
						</span>
						<span
							className={cn(
								"inline-flex gap-1 text-md select-none disabled:text-neutral-400",
								variant === "facet" && "flex-1",
							)}
						>
							<span
								className={cn(
									variant === "facet" && "inline-flex flex-1 items-center justify-between gap-1",
								)}
							>
								{children}
							</span>
							{isRequired ? <RequiredIndicator /> : null}
						</span>
					</Fragment>
				);
			})}
		</AriaCheckBox>
	);
}
