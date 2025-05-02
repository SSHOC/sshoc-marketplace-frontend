import { useFocusable, useFocusRing } from "@react-aria/focus";
import { useHover, usePress } from "@react-aria/interactions";
import type { AriaLinkOptions as AriaLinkProps } from "@react-aria/link";
import { filterDOMProps, mergeProps } from "@react-aria/utils";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import type { ComponentPropsWithoutRef, CSSProperties, ForwardedRef, ReactNode } from "react";
import { forwardRef, useRef } from "react";
import useComposedRef from "use-composed-ref";

import css from "@/lib/core/ui/Link/Link.module.css";
import type { Locale } from "~/config/i18n.config";

export interface LinkStyleProps {
	"--link-color"?: CSSProperties["color"];
	"--link-color-focus"?: CSSProperties["color"];
	"--link-color-hover"?: CSSProperties["color"];
	"--link-color-active"?: CSSProperties["color"];
	"--link-color-disabled"?: CSSProperties["color"];
	"--link-text-decoration"?: CSSProperties["textDecoration"];
	"--link-cursor"?: CSSProperties["cursor"];
}

export interface LinkProps
	extends AriaLinkProps,
		Pick<ComponentPropsWithoutRef<"a">, "aria-current" | "id">,
		Omit<NextLinkProps, "as" | "href" | "locale" | "passHref"> {
	children: ReactNode;
	href: string;
	locale?: Locale;
	/** @default 'primary' */
	variant?:
		| "breadcrumb"
		| "heading"
		| "nav-link-footer"
		| "nav-link-header"
		| "nav-menu-link"
		| "nav-mobile-menu-link-secondary"
		| "nav-mobile-menu-link"
		| "pagination"
		| "primary"
		| "skip-link"
		| "tag"
		| "text";
}

export const Link = forwardRef(function Link(
	props: LinkProps,
	forwardedRef: ForwardedRef<HTMLAnchorElement>,
): ReactNode {
	const {
		children,
		elementType,
		href,
		variant, // = 'primary'
	} = props;

	const linkRef = useRef<HTMLAnchorElement>(null);
	const ref = useComposedRef(linkRef, forwardedRef);

	const isDisabled = props.isDisabled === true;
	const isCurrent = Boolean(props["aria-current"]);
	const isLinkElement = Boolean(props.href) && !isDisabled;
	const ElementType = elementType ?? (isLinkElement ? NextLink : "span");

	const { focusableProps } = useFocusable(props, linkRef);
	const { pressProps, isPressed } = usePress({ ...props, ref: linkRef });
	const { hoverProps, isHovered } = useHover(props);
	const { focusProps, isFocused, isFocusVisible } = useFocusRing();

	return (
		<ElementType
			ref={ref}
			{...mergeProps(
				filterDOMProps(props, { labelable: true, isLink: isLinkElement }),
				focusableProps,
				pressProps,
				hoverProps,
				focusProps,
			)}
			aria-disabled={isDisabled || undefined}
			className={css["link"]}
			data-active={isPressed || undefined}
			data-current={isCurrent || undefined}
			data-disabled={isDisabled || undefined}
			data-focused={isFocused || undefined}
			data-focus-visible={isFocusVisible || undefined}
			data-hovered={isHovered || undefined}
			data-pressed={isPressed || undefined}
			data-variant={variant}
			href={href}
			role={!isLinkElement ? "link" : undefined}
		>
			{children}
		</ElementType>
	);
});
