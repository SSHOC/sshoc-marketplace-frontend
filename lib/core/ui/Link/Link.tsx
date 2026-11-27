import css from "@/lib/core/ui/Link/Link.module.css";

import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import type { CSSProperties, ReactNode, Ref } from "react";
import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";

export interface LinkStyleProps {
	"--link-color"?: CSSProperties["color"];
	"--link-color-focus"?: CSSProperties["color"];
	"--link-color-hover"?: CSSProperties["color"];
	"--link-color-active"?: CSSProperties["color"];
	"--link-color-disabled"?: CSSProperties["color"];
	"--link-text-decoration"?: CSSProperties["textDecoration"];
	"--link-cursor"?: CSSProperties["cursor"];
}

interface NextAriaLinkProps
	extends
		Omit<AriaLinkProps, "children" | "className" | "render" | "routerOptions" | "style">,
		Pick<NextLinkProps, "locale" | "onNavigate" | "prefetch" | "replace" | "scroll" | "shallow"> {
	children: ReactNode;
	className?: string;
	href: string;
	ref?: Ref<HTMLAnchorElement>;
	style?: CSSProperties;
}

export function NextAriaLink({
	href,
	isDisabled,
	locale,
	onNavigate,
	prefetch,
	replace,
	scroll,
	shallow,
	...props
}: NextAriaLinkProps): ReactNode {
	return (
		<AriaLink
			slot={null}
			{...props}
			href={isDisabled || href === "" ? undefined : href}
			isDisabled={isDisabled}
			render={(domProps) =>
				"href" in domProps ? (
					<NextLink
						{...domProps}
						locale={locale}
						onNavigate={onNavigate}
						prefetch={prefetch}
						replace={replace}
						scroll={scroll}
						shallow={shallow}
					/>
				) : (
					<span {...domProps} />
				)
			}
		/>
	);
}

export interface LinkProps extends Omit<NextAriaLinkProps, "className"> {
	/** @default 'primary' */
	variant?: "breadcrumb" | "heading" | "pagination" | "primary" | "tag" | "text";
}

export function Link({ variant, ...props }: LinkProps): ReactNode {
	return <NextAriaLink {...props} className={css["link"]} data-variant={variant} />;
}
