import type { ReactNode } from "react";

import { usePage } from "@/lib/core/page/PageProvider";

/**
 * TODO: Currently not rendered anywhere, because the page loading indicator
 * is added imperatively bey `nprogress`.
 */
export function PageLoadingIndicator(): ReactNode {
	const { pageLoadingIndicator } = usePage();

	return <div {...pageLoadingIndicator.progressProps} />;
}
