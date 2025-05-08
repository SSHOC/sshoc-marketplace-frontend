import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";

import { LinkButton } from "@/components/common/LinkButton";
import type { UseIsCurrentRouteArgs } from "@/lib/core/navigation/useIsCurrentRoute";
import { useIsCurrentRoute } from "@/lib/core/navigation/useIsCurrentRoute";

export interface NavLinkButtonProps
	extends ComponentPropsWithoutRef<typeof LinkButton>,
		UseIsCurrentRouteArgs {
	href: string;
}

export const NavLinkButton = forwardRef(function NavLinkButton(
	props: NavLinkButtonProps,
	forwardedRef: ForwardedRef<HTMLAnchorElement>,
): ReactNode {
	const { href, isCurrent, ...linkProps } = props;

	const isCurrentRoute = useIsCurrentRoute({ href, isCurrent });

	return (
		<LinkButton
			ref={forwardedRef}
			{...linkProps}
			aria-current={isCurrentRoute ? "page" : undefined}
			href={href}
		/>
	);
});
