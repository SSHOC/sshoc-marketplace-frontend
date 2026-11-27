import css from "@/lib/core/ui/Button/Button.module.css";

import type { CSSProperties, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";

export interface ButtonStyleProps {
	"--button-color"?: CSSProperties["color"];
	"--button-color-focus"?: CSSProperties["color"];
	"--button-color-hover"?: CSSProperties["color"];
	"--button-color-active"?: CSSProperties["color"];
	"--button-color-disabled"?: CSSProperties["color"];
	"--button-background-color"?: CSSProperties["backgroundColor"];
	"--button-background-color-focus"?: CSSProperties["backgroundColor"];
	"--button-background-color-hover"?: CSSProperties["backgroundColor"];
	"--button-background-color-active"?: CSSProperties["backgroundColor"];
	"--button-background-color-disabled"?: CSSProperties["backgroundColor"];
	"--button-border-radius"?: CSSProperties["borderRadius"];
	"--button-border-color"?: CSSProperties["borderColor"];
	"--button-border-color-focus"?: CSSProperties["borderColor"];
	"--button-border-color-hover"?: CSSProperties["borderColor"];
	"--button-border-color-active"?: CSSProperties["borderColor"];
	"--button-border-color-disabled"?: CSSProperties["borderColor"];
	"--button-border-width"?: CSSProperties["borderWidth"];
	"--button-font-size"?: CSSProperties["fontSize"];
	"--button-font-weight"?: CSSProperties["fontWeight"];
	"--button-line-height"?: CSSProperties["lineHeight"];
	"--button-padding-inline"?: CSSProperties["paddingInline"];
	"--button-padding-block"?: CSSProperties["paddingBlock"];
	"--button-cursor"?: CSSProperties["cursor"];
}

export interface ButtonProps extends Omit<AriaButtonProps, "className" | "style" | "children"> {
	children: ReactNode;
	/** @default 'primary' */
	color?: "gradient" | "negative" | "positive" | "primary" | "secondary";
	form?: string;
	isPressed?: boolean;
	/** @default 'md' */
	size?: "lg" | "md" | "sm" | "xs";
	style?: ButtonStyleProps;
	trigger?: "collapsed" | "expanded";
	/** @default 'fill' */
	variant?: "border" | "fill" | "nav-mobile-menu-link-secondary" | "nav-mobile-menu-link";
}

export const Button = forwardRef(function Button(
	props: ButtonProps,
	ref: ForwardedRef<HTMLButtonElement>,
): ReactNode {
	const {
		color = "primary",
		isPressed = false,
		size = "md",
		slot = null,
		style,
		trigger,
		variant = "fill",
		...buttonProps
	} = props;

	return (
		<AriaButton
			{...buttonProps}
			ref={ref}
			slot={slot}
			className={css["button"]}
			data-color={color}
			data-active={isPressed ? "" : undefined}
			data-size={size}
			data-variant={variant}
			data-trigger={trigger}
			style={style as CSSProperties}
		/>
	);
});
