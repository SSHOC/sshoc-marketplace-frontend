import type { LinkProps } from "next/link";
import { useMemo } from "react";

import { useRoute } from "@/lib/core/navigation/useRoute";

export type Matcher = (href: LinkProps["href"], route: URL) => boolean;

const isMatchingPathnames: Matcher = function isMatchingPathnames(href, route) {
	return (
		(typeof href === "string" ? new URL(href, "https://n").pathname : href.pathname) ===
		route.pathname
	);
};

export interface UseIsCurrentRouteArgs {
	href: LinkProps["href"];
	isCurrent?: Matcher | boolean | undefined;
}

export function useIsCurrentRoute(options: UseIsCurrentRouteArgs): boolean {
	const { href, isCurrent = isMatchingPathnames } = options;

	const route = useRoute();

	const isCurrentRoute = useMemo(() => {
		return typeof isCurrent === "boolean" ? isCurrent : isCurrent(href, route);
	}, [route, href, isCurrent]);

	return isCurrentRoute;
}
