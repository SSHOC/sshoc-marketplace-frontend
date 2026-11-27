import css from "@/lib/core/ui/FieldButton/FieldButton.module.css";

import type { DOMProps, ValidationState } from "@react-types/shared";
import type { CSSProperties, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";

export interface FieldButtonStyleProps {
	"--field-button-width"?: CSSProperties["width"];
	"--field-button-height"?: CSSProperties["height"];
	"--field-button-border-radius"?: CSSProperties["borderRadius"];
	"--field-button-background-color"?: CSSProperties["backgroundColor"];
	"--field-button-background-color-focus"?: CSSProperties["backgroundColor"];
	"--field-button-background-color-hover"?: CSSProperties["backgroundColor"];
	"--field-button-background-color-active"?: CSSProperties["backgroundColor"];
	"--field-button-background-color-disabled"?: CSSProperties["backgroundColor"];
	"--field-button-border-color"?: CSSProperties["borderColor"];
	"--field-button-border-color-focus"?: CSSProperties["borderColor"];
	"--field-button-border-color-hover"?: CSSProperties["borderColor"];
	"--field-button-border-color-active"?: CSSProperties["borderColor"];
	"--field-button-border-color-disabled"?: CSSProperties["borderColor"];
	"--field-button-border-width"?: CSSProperties["borderWidth"];
	"--field-button-color"?: CSSProperties["color"];
	"--field-button-color-focus"?: CSSProperties["color"];
	"--field-button-color-hover"?: CSSProperties["color"];
	"--field-button-color-active"?: CSSProperties["color"];
	"--field-button-color-disabled"?: CSSProperties["color"];
	"--field-button-padding-inline"?: CSSProperties["paddingInline"];
	"--field-button-padding-block"?: CSSProperties["paddingBlock"];
	"--field-button-font-size"?: CSSProperties["fontSize"];
	"--field-button-font-weight"?: CSSProperties["fontWeight"];
	"--field-button-line-height"?: CSSProperties["lineHeight"];
}

export interface FieldButtonProps extends Omit<AriaButtonProps, "className" | "style">, DOMProps {
	/** @default 'primary' */
	color?: "form" | "primary";
	isActive?: boolean;
	preventFocusOnPress?: boolean;
	style?: CSSProperties & FieldButtonStyleProps;
	validationState?: ValidationState;
}

export const FieldButton = forwardRef(function FieldButton(
	props: FieldButtonProps,
	ref: ForwardedRef<HTMLButtonElement>,
): ReactNode {
	const {
		color = "primary",
		isActive = false,
		slot = null,
		validationState,
		...buttonProps
	} = props;

	return (
		<AriaButton
			{...buttonProps}
			ref={ref}
			slot={slot}
			className={css["button"]}
			data-color={color}
			data-active={isActive ? "" : undefined}
			data-validation-state={validationState}
		/>
	);
});
