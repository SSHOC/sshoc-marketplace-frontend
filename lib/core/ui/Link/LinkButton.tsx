import css from "@/lib/core/ui/Button/Button.module.css";
import linkStyles from "@/lib/core/ui/Link/Link.module.css";

import cx from "clsx";
import type { ReactNode } from "react";

import type { ButtonProps } from "@/lib/core/ui/Button/Button";
import { type LinkProps, NextAriaLink } from "@/lib/core/ui/Link/Link";

export interface LinkButtonProps
	extends
		Omit<LinkProps, "variant" | "style">,
		Pick<ButtonProps, "color" | "size" | "style" | "variant"> {}

export function LinkButton({
	color = "primary",
	size = "md",
	variant = "fill",
	style,
	...props
}: LinkButtonProps): ReactNode {
	return (
		<NextAriaLink
			{...props}
			className={cx(css["button"], linkStyles["link-button"])}
			data-color={color}
			data-size={size}
			data-variant={variant}
			style={style as LinkProps["style"]}
		/>
	);
}
