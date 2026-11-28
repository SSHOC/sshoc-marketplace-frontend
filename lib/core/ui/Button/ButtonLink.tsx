import buttonCss from "@/lib/core/ui/Button/Button.module.css";
import css from "@/lib/core/ui/Link/Link.module.css";

import cx from "clsx";
import type { CSSProperties, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";

import type { LinkProps } from "@/lib/core/ui/Link/Link";

export interface ButtonLinkProps
	extends Omit<AriaButtonProps, "className" | "style" | "children">, Pick<LinkProps, "style"> {
	children: ReactNode;
	form?: string;
	isPressed?: boolean;
	trigger?: "collapsed" | "expanded";
}

export const ButtonLink = forwardRef(function ButtonLink(
	props: ButtonLinkProps,
	ref: ForwardedRef<HTMLButtonElement>,
): ReactNode {
	const { isPressed = false, slot = null, style, trigger, ...buttonProps } = props;

	return (
		<AriaButton
			{...buttonProps}
			ref={ref}
			slot={slot}
			className={cx(css["link"], buttonCss["button-link"])}
			data-active={isPressed ? "" : undefined}
			data-trigger={trigger}
			style={style as CSSProperties}
		/>
	);
});
