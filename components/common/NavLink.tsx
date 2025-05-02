import type { ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";

import type { LinkProps } from "@/components/common/Link";
import { Link } from "@/components/common/Link";
import type { UseIsCurrentRouteArgs } from "@/lib/core/navigation/useIsCurrentRoute";
import { useIsCurrentRoute } from "@/lib/core/navigation/useIsCurrentRoute";

export interface NavLinkProps extends LinkProps, UseIsCurrentRouteArgs {}

export const NavLink = forwardRef(function NavLink(
	props: NavLinkProps,
	forwardedRef: ForwardedRef<HTMLAnchorElement>,
): ReactNode {
	const { href, isCurrent, ...linkProps } = props;

	const isCurrentRoute = useIsCurrentRoute({ href, isCurrent });

	return (
		<Link
			ref={forwardedRef}
			{...linkProps}
			aria-current={isCurrentRoute ? "page" : undefined}
			href={href}
		/>
	);
});
