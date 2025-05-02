import { useFocusable, useFocusRing } from "@react-aria/focus";
import { useHover, usePress } from "@react-aria/interactions";
import type { AriaLinkOptions as AriaLinkProps } from "@react-aria/link";
import { filterDOMProps, mergeProps } from "@react-aria/utils";
import cx from "clsx";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from "react";
import { forwardRef, useRef } from "react";
import useComposedRef from "use-composed-ref";

import type { ButtonProps } from "@/lib/core/ui/Button/Button";
import css from "@/lib/core/ui/Button/Button.module.css";
import linkStyles from "@/lib/core/ui/Link/Link.module.css";
import type { Locale } from "~/config/i18n.config.mjs";

export interface LinkButtonProps
	extends AriaLinkProps,
		Pick<ComponentPropsWithoutRef<"a">, "aria-current" | "id">,
		Omit<NextLinkProps, "as" | "href" | "locale" | "passHref">,
		Pick<ButtonProps, "color" | "size" | "style" | "variant"> {
	children: ReactNode;
	href: string;
	locale?: Locale;
}

export const LinkButton = forwardRef(function LinkButton(
	props: LinkButtonProps,
	forwardedRef: ForwardedRef<HTMLAnchorElement>,
): ReactNode {
	const { color = "primary", children, href, size = "md", variant = "fill" } = props;

	const linkRef = useRef<HTMLAnchorElement>(null);
	const ref = useComposedRef(linkRef, forwardedRef);

	const isDisabled = props.isDisabled === true;
	const isCurrent = Boolean(props["aria-current"]);

	const { focusableProps } = useFocusable(props, linkRef);
	const { pressProps, isPressed } = usePress({ ...props, ref: linkRef });
	const { hoverProps, isHovered } = useHover(props);
	const { focusProps, isFocused, isFocusVisible } = useFocusRing();

	return (
		<NextLink
			ref={ref}
			{...mergeProps(
				filterDOMProps(props, { labelable: true, isLink: true }),
				focusableProps,
				pressProps,
				hoverProps,
				focusProps,
			)}
			aria-disabled={isDisabled || undefined}
			className={cx(css["button"], linkStyles["link-button"])}
			data-active={isPressed || undefined}
			data-color={color}
			data-current={isCurrent || undefined}
			data-disabled={isDisabled || undefined}
			data-focused={isFocused || undefined}
			data-focus-visible={isFocusVisible || undefined}
			data-hovered={isHovered || undefined}
			data-pressed={isPressed || undefined}
			data-size={size}
			data-variant={variant}
			href={href}
		>
			{children}
		</NextLink>
	);
});
