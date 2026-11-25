import css from "@/lib/core/ui/Field/Field.module.css";

import type { LabelPosition } from "@react-types/shared";
import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { cloneElement, forwardRef, isValidElement } from "react";

import type { HelpTextProps } from "@/lib/core/ui/HelpText/HelpText";
import { HelpText } from "@/lib/core/ui/HelpText/HelpText";
import type { LabelProps } from "@/lib/core/ui/Label/Label";
import { Label } from "@/lib/core/ui/Label/Label";

export interface FieldProps extends Omit<LabelProps, "elementType" | "onClick">, HelpTextProps {
	children: ReactNode;
	descriptionProps?: HTMLAttributes<HTMLElement>;
	errorMessageProps?: HTMLAttributes<HTMLElement>;
	label?: ReactNode;
	labelElementType?: LabelProps["elementType"];
	labelProps?: HTMLAttributes<HTMLElement>;
}

export const Field = forwardRef(function Field(
	props: FieldProps,
	forwardedRef: ForwardedRef<HTMLDivElement>,
): ReactNode {
	const {
		children,
		description,
		descriptionProps,
		errorMessage,
		errorMessageProps,
		includeNecessityIndicatorInAccessibilityName,
		isDisabled,
		isRequired,
		label,
		labelAlign,
		labelElementType,
		labelPosition = "top" as LabelPosition,
		labelProps,
		necessityIndicator,
		showErrorIcon,
		validationState,
	} = props;

	const hasHelpText =
		Boolean(description) || (Boolean(errorMessage) && validationState === "invalid");

	if (label != null || hasHelpText) {
		return (
			<div ref={forwardedRef} className={css["field"]}>
				{label != null ? (
					<Label
						{...labelProps}
						elementType={labelElementType}
						includeNecessityIndicatorInAccessibilityName={
							includeNecessityIndicatorInAccessibilityName
						}
						isRequired={isRequired}
						labelAlign={labelAlign}
						labelPosition={labelPosition}
						necessityIndicator={necessityIndicator}
					>
						{label}
					</Label>
				) : null}
				<div>
					{children}
					{hasHelpText ? (
						<HelpText
							description={description}
							descriptionProps={descriptionProps}
							errorMessage={errorMessage}
							errorMessageProps={errorMessageProps}
							isDisabled={isDisabled}
							showErrorIcon={showErrorIcon}
							validationState={validationState}
						/>
					) : null}
				</div>
			</div>
		);
	}

	return isValidElement<{ ref?: ForwardedRef<HTMLDivElement> }>(children)
		? cloneElement(children, { ref: forwardedRef })
		: children;
});
