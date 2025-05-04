import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { useHover } from "@react-aria/interactions";
import { mergeProps } from "@react-aria/utils";
import type { AriaButtonProps } from "@react-types/button";
import type { CSSProperties, ElementType, ForwardedRef, ReactNode } from "react";
import { forwardRef, useRef } from "react";
import useComposedRef from "use-composed-ref";

import css from "@/lib/core/ui/Button/Button.module.css";

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

export interface ButtonProps<T extends ElementType = "button"> extends AriaButtonProps<T> {
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

export const Button = forwardRef(function Button<T extends ElementType = "button">(
	props: ButtonProps<T>,
	forwardedRef: ForwardedRef<HTMLButtonElement>,
): ReactNode {
	const {
		color = "primary",
		children,
		elementType: ElementType = "button",
		isPressed = false,
		size = "md",
		style,
		trigger,
		variant = "fill",
	} = props;

	const buttonRef = useRef<HTMLButtonElement>(null);
	const { buttonProps, isPressed: isActive } = useButton(props, buttonRef);
	const { focusProps, isFocusVisible } = useFocusRing(props);
	const { hoverProps, isHovered } = useHover(props);

	const ref = useComposedRef(buttonRef, forwardedRef);

	return (
		<ElementType
			ref={ref}
			{...mergeProps(buttonProps, focusProps, hoverProps)}
			className={css["button"]}
			data-color={color}
			data-active={isPressed || isActive ? "" : undefined}
			data-focused={isFocusVisible ? "" : undefined}
			data-hovered={isHovered ? "" : undefined}
			data-size={size}
			data-variant={variant}
			data-trigger={trigger}
			style={style as CSSProperties}
		>
			{children}
		</ElementType>
	);
}) as <T extends ElementType = "button">(
	props: ButtonProps<T> & { ref?: ForwardedRef<HTMLElement> },
) => ReactNode;
