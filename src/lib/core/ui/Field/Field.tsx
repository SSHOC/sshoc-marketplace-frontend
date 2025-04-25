import { mergeProps } from "@react-aria/utils";
import type { LabelPosition } from "@react-types/shared";
import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { cloneElement, forwardRef } from "react";

import css from "@/lib/core/ui/Field/Field.module.css";
import type { HelpTextProps } from "@/lib/core/ui/HelpText/HelpText";
import { HelpText } from "@/lib/core/ui/HelpText/HelpText";
import type { LabelProps } from "@/lib/core/ui/Label/Label";
import { Label } from "@/lib/core/ui/Label/Label";

export interface FieldProps extends Omit<LabelProps, "elementType">, HelpTextProps {
	children: JSX.Element;
	descriptionProps?: HTMLAttributes<HTMLElement>;
	errorMessageProps?: HTMLAttributes<HTMLElement>;
	label?: ReactNode;
	labelElementType?: LabelProps["elementType"];
	labelProps?: HTMLAttributes<HTMLElement>;
}

export const Field = forwardRef(function Field(
	props: FieldProps,
	forwardedRef: ForwardedRef<HTMLDivElement>,
): JSX.Element {
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

	return cloneElement(children, mergeProps(children.props, { ref: forwardedRef }));
});
